#!/usr/bin/env python3
"""CSS gates shared by check-publish.py and check-app.py.

WHY THEY LIVE HERE. check-publish.py walks the GENERATED tree, where the CSS
is inside <style> blocks in one HTML file. check-app.py walks the SOURCE tree,
where the same CSS is 22 separate .css files. Both need the same four
scanners, and two copies of a scanner is two places for one of them to stop
being true. Importable, with a main() guard so importing it runs nothing.

Every scanner here is a hand-written lexer rather than a regex, because CSS
comments and strings can contain braces, quotes and the word ':hover', and a
regex that ignores that reports clean on the file it is wrong about.

Run directly on any .css or .html file to see what it finds.
"""
import io, os, re, sys


def _scan(css):
    """Yield (kind, line, text) over a stylesheet, skipping comments and strings.

    kind is 'open' (a '{', text is the prelude), 'close' (a '}'), or 'semi'.

    THE PRELUDE IS ACCUMULATED CHARACTER BY CHARACTER RATHER THAN SLICED, and
    that is not a style choice. Slicing from the last delimiter sweeps any
    comment sitting above the rule into the selector, so a rule preceded by a
    comment that happens to contain the word ':hover' reads as a :hover rule.
    Nothing caught that for as long as these scanners ran only over the BUILT
    tree, where every comment has already been stripped -- which is the whole
    argument for the source tree having its own checker.
    """
    i, n, line = 0, len(css), 1
    buf = []
    while i < n:
        c = css[i]
        if css[i:i + 2] == '/*':
            j = css.find('*/', i + 2); j = n if j < 0 else j + 2
            line += css.count('\n', i, j); i = j
            buf.append(' ')                      # a comment is whitespace
            continue
        if c in '"\'':
            q = c; j = i + 1
            while j < n:
                if css[j] == '\\': j += 2; continue
                if css[j] == q: j += 1; break
                j += 1
            buf.append(css[i:j])                 # a string IS part of a prelude
            line += css.count('\n', i, j); i = j; continue
        if c == '\n':
            line += 1; buf.append(' ')
        elif c == '{':
            yield 'open', line, ' '.join(''.join(buf).split()); buf = []
        elif c == '}':
            yield 'close', line, ''; buf = []
        elif c == ';':
            yield 'semi', line, ''; buf = []
        else:
            buf.append(c)
        i += 1


def css_depth_errors(css):
    """Brace depth over a stylesheet, ignoring comments and strings.

    THIS EXISTS BECAUSE ONE DID NOT, and the bug shipped: a single orphaned '}'
    sat above .lm{position:relative}. At the top level CSS does not discard a
    stray brace -- it starts a qualified rule, takes '}' as the beginning of a
    selector, and swallows everything through the NEXT {...}. So the brace and
    the rule after it were parsed as one bogus rule and both were dropped.

    IT REPORTED NOTHING. No console error, and the rules on either side parsed
    normally, so the only symptom was that every list menu opened 550px from
    its button.
    """
    out, depth = [], 0
    for kind, line, _ in _scan(css):
        if kind == 'open':
            depth += 1
        elif kind == 'close':
            depth -= 1
            if depth < 0:
                out.append(f"stray '}}' at stylesheet line {line}")
                depth = 0                       # keep going, report every one
    if depth > 0:
        out.append(f"{depth} unclosed block(s) at end of stylesheet")
    return out


def comment_delimiter_errors(css):
    """Comment delimiters, tracked in one pass over the stylesheet.

    THIS EXISTS BECAUSE css_depth_errors REPORTED CLEAN ON THE FILE IT WAS
    WRONG ABOUT. 35-record.css closed a comment four paragraphs early, which
    orphaned the '*/' below it. Those paragraphs became live CSS text, the
    parser took them as a selector prelude and consumed everything through the
    next '{', and the whole .rec{...} rule after them was dropped -- display,
    flex, min-height, background, border and radius, silently gone. The record
    stopped being a card and the right column stopped scrolling.

    NOTHING CAUGHT IT. The braces still balanced, so css_depth_errors passed;
    check-app.py's comment stripper is the same non-greedy scan the browser
    uses, so it AGREED with the browser about the damage instead of reporting
    it. An orphaned '*/' is invisible to every scanner that treats comments as
    whitespace, which is all of the others here.

    A '*/' inside a string is not a delimiter -- content:"*/" is legal -- so
    strings are skipped exactly the way _scan skips them.
    """
    out = []
    i, n, line = 0, len(css), 1
    while i < n:
        if css[i:i + 2] == '/*':
            j = css.find('*/', i + 2)
            if j < 0:
                out.append(f"unterminated '/*' opened at stylesheet line {line}")
                return out
            line += css.count('\n', i, j + 2); i = j + 2; continue
        if css[i] in '"\'':
            q = css[i]; j = i + 1
            while j < n:
                if css[j] == '\\': j += 2; continue
                if css[j] == q: j += 1; break
                j += 1
            line += css.count('\n', i, j); i = j; continue
        if css[i:i + 2] == '*/':
            out.append(f"stray '*/' at stylesheet line {line}")
            i += 2; continue
        if css[i] == '\n': line += 1
        i += 1
    return out


def _hover_gated(prelude):
    return prelude.startswith('@media') and 'hover:hover' in prelude.replace(' ', '')


def ungated_hovers(css):
    """Every :hover must sit inside @media (hover:hover).

    WHY THIS IS A GATE AND NOT A REVIEW NOTE. On a touch screen an ungated
    hover state applies on TAP and stays applied until something else is
    tapped, so the control reads as held down long after the act finished.
    Nothing on a desktop shows it and no screenshot catches it. The file had
    exactly one -- .set-rank, written beside its component instead of into the
    hover block below it, and so missed by position rather than by argument.
    """
    out, stack = [], []
    for kind, line, prelude in _scan(css):
        if kind == 'open':
            # an at-rule prelude carries ':hover' as a FEATURE, not a selector
            if ':hover' in prelude and not prelude.startswith('@') and not any(stack):
                out.append((line, prelude[-80:]))
            stack.append(_hover_gated(prelude))
        elif kind == 'close' and stack:
            stack.pop()
    return out


def base_rules_in_hover_gate(css):
    """THE INVERSE OF ungated_hovers, and nothing caught it before.

    .pg-back's ENTIRE base rule -- display, height, padding, radius, gap,
    transition and :active -- sat inside @media (hover:hover) and
    (pointer:fine). On a coarse pointer at or above the 1024px floor (an iPad
    Pro in landscape, a touch laptop) the Back control on all four destination
    pages fell back to the bare button reset, while every grep for the base
    rule found it present.

    NO SCREENSHOT AT ANY WIDTH CAN CATCH THIS on the machine that took it,
    which is exactly what a gate is for. The rule: every selector inside a
    hover-gated block must itself name :hover. A rule that does not is
    describing the control rather than describing hovering it, and it belongs
    outside the gate -- :active included, because :active fires on touch.
    """
    out, stack = [], []
    for kind, line, prelude in _scan(css):
        if kind == 'open':
            inside = any(stack)
            if inside and not prelude.startswith('@') and ':hover' not in prelude:
                out.append((line, prelude[-80:]))
            stack.append(_hover_gated(prelude))
        elif kind == 'close' and stack:
            stack.pop()
    return out


def styles_in(path, text):
    """The stylesheets in a file: a .css file is one; an .html file has n."""
    if path.endswith('.css'):
        return [text]
    return re.findall(r'<style[^>]*>(.*?)</style>', text, re.S | re.I)


def main():
    if len(sys.argv) < 2:
        print(__doc__.strip()); return 2
    bad = 0
    for p in sys.argv[1:]:
        t = io.open(p, encoding='utf-8').read()
        for blk in styles_in(p, t):
            for m in comment_delimiter_errors(blk):
                print(f'{p}: {m}'); bad += 1
            for m in css_depth_errors(blk):
                print(f'{p}: {m}'); bad += 1
            for ln, sel in ungated_hovers(blk):
                print(f'{p}:{ln}: ungated :hover -- {sel}'); bad += 1
            for ln, sel in base_rules_in_hover_gate(blk):
                print(f'{p}:{ln}: base rule inside a hover gate -- {sel}'); bad += 1
    print(f'{bad} problem(s)')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
