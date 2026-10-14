/* core/primitives — the shared render primitives.
 *
 * EXTRACTED from design/previews/terrain-prototype.html by brace matching, so
 * these are the prototype's own functions rather than a memory of them.
 *
 * IT LIVED UNDER charts/ UNTIL 2026-09-23, AND THE PATH WAS ALWAYS WRONG. Half
 * that file drew charts; half of it drew the skeleton bar and the page card, which the list, the record, the masthead and all four
 * destinations read. The analysis surfaces are gone and the seven functions
 * only they used went with them — MARK, HATCH, band, bandRow, maxOf, markFill
 * and barStyle. What is left never belonged to a chart.
 *
 * It sits in core/ because that is what it is: dependency-free, benched by
 * lab.html, read by every surface.
 */

export function bar(w, h){ return '<span class="sk sk-h-' + (h || 'body') + ' ' + w + '"></span>'; }

export function bars(cnt, ws){
  var out = [], i;
  for (i = 0; i < cnt; i++) out.push(bar(ws[i % ws.length]));
  return out.join('');
}

export function sk(w, cls){
  return '<span class="sk sk-h-body ' + (cls || '') + '"'
       + (w ? ' style="width:' + w + '"' : '') + '></span>';
}


export function pgCard(title, icon, body, head){
  return '<section class="card"><div class="card-head"><span class="card-icon">' + icon + '</span>'
       + '<h2 class="t-title">' + title + '</h2>' + (head || '') + '</div>'
       + '<div class="card-body">' + body + '</div></section>';
}

export function numCell(w){ return '<td class="num">' + sk(w) + '</td>'; }

/* ══ THE LANGUAGE OF A PUBLISHED TEXT ══════════════════════════════════════
 * Nineteen of the corpus's ninety-nine abstracts are Simplified Chinese, and
 * every one of them shipped inside a document declaring lang="en". Two things
 * follow from that lie, both measured: Chrome resolves the run with a
 * TRADITIONAL face (PingFang TC on macOS) and renders Simplified text in the
 * wrong regional glyph forms, and a screen reader reads 本发明公开了 aloud in
 * an English voice.
 *
 * THIS IS NOT A CJK SURFACE AND DOES NOT ADD A FACE. CLAUDE.md's English-only
 * rule is about the INTERFACE — no Chinese chrome, no bilingual markup, no
 * data-zh — and no font is being shipped here; the system picks one. What is
 * being fixed is a claim the markup was making about data it did not write.
 * Declining the abstract instead was the alternative and it is the worse one:
 * "Terrain prints what the patent says" is the product, and a bar means "this
 * value exists and we decline to print it", which would be a strange thing to
 * say about an abstract that is present and perfectly printable.
 *
 * THE OFFICE CODE DECIDES, NOT THE SCRIPT, wherever it is known. A patent
 * number carries its issuing office in the first two characters, and that is
 * a harder signal than glyph ranges: a Japanese abstract written mostly in
 * kanji has no kana to detect, and would otherwise be tagged as Chinese.
 * Script detection is the fallback for an office this map has not met. */
const OFFICE_LANG = { CN:'zh-Hans', TW:'zh-Hant', HK:'zh-Hant', JP:'ja', KR:'ko' };

export function langAttr(text, number) {
  const t = String(text || '');
  /* Han, kana and Hangul. Latin text returns nothing and the element keeps
     the document's own lang, which is the correct answer for 80 of these. */
  if (!/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(t)) return '';
  const office = OFFICE_LANG[String(number || '').slice(0, 2).toUpperCase()];
  if (office) return ' lang="' + office + '"';
  if (/[\u3040-\u30ff]/.test(t)) return ' lang="ja"';
  if (/[\uac00-\ud7af]/.test(t)) return ' lang="ko"';
  return ' lang="zh-Hans"';
}
