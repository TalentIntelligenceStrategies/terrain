import io,re,sys

def strip_js(s):
    """Remove /* */ and // comments, honouring strings, template literals and regex literals."""
    out=[]; i=0; n=len(s); prev=''   # prev = last significant char emitted
    tstack=[]                        # template-literal ${ } depth tracking
    while i<n:
        c=s[i]; d=s[i:i+2]
        if d=='/*':
            j=s.find('*/',i+2); j=n if j<0 else j+2
            out.append('\n'*s.count('\n',i,j)); i=j; continue
        if d=='//':
            j=s.find('\n',i); j=n if j<0 else j
            i=j; continue
        if c in '"\'':
            q=c; j=i+1
            while j<n:
                if s[j]=='\\': j+=2; continue
                if s[j]==q: j+=1; break
                j+=1
            out.append(s[i:j]); prev=q; i=j; continue
        if c=='`':
            j=i+1
            while j<n:
                if s[j]=='\\': j+=2; continue
                if s[j]=='`': j+=1; break
                if s[j:j+2]=='${': tstack.append(1); j+=2; continue
                j+=1
            out.append(s[i:j]); prev='`'; i=j; continue
        if c=='/':
            # regex literal iff the previous significant char cannot end an expression
            if prev not in (')',']','}') and not (prev.isalnum() or prev in '_$"\'`'):
                j=i+1; cls=False; ok=False
                while j<n:
                    ch=s[j]
                    if ch=='\\': j+=2; continue
                    if ch=='[': cls=True
                    elif ch==']': cls=False
                    elif ch=='/' and not cls: j+=1; ok=True; break
                    elif ch=='\n': break
                    j+=1
                if ok:
                    while j<n and s[j].isalpha(): j+=1   # flags
                    out.append(s[i:j]); prev='/'; i=j; continue
        out.append(c)
        if not c.isspace(): prev=c
        i+=1
    return ''.join(out)

def strip_css(s):
    out=[]; i=0; n=len(s)
    while i<n:
        if s[i:i+2]=='/*':
            j=s.find('*/',i+2); j=n if j<0 else j+2
            out.append('\n'*s.count('\n',i,j)); i=j; continue
        if s[i] in '"\'':
            q=s[i]; j=i+1
            while j<n:
                if s[j]=='\\': j+=2; continue
                if s[j]==q: j+=1; break
                j+=1
            out.append(s[i:j]); i=j; continue
        out.append(s[i]); i+=1
    return ''.join(out)

src=io.open(sys.argv[1],encoding='utf-8').read()

# 1. rewrite script/style bodies
def repl(m):
    tag,attrs,body=m.group(1),m.group(2),m.group(3)
    new=strip_js(body) if tag.lower()=='script' else strip_css(body)
    return f'<{tag}{attrs}>{new}</{tag}>'
stage1=re.sub(r'<(script|style)([^>]*)>(.*?)</\1>', repl, src, flags=re.S|re.I)

# 2. remove HTML comments only OUTSIDE script/style
parts=re.split(r'(<(?:script|style)\b[^>]*>.*?</(?:script|style)>)', stage1, flags=re.S|re.I)
for k in range(0,len(parts),2):
    parts[k]=re.sub(r'<!--.*?-->', lambda m:'\n'*m.group(0).count('\n'), parts[k], flags=re.S)
out=''.join(parts)

# 3. collapse the blank lines the removals left
out=re.sub(r'\n[ \t]*(?:\n[ \t]*)+\n', '\n\n', out)
io.open(sys.argv[2],'w',encoding='utf-8').write(out)
print(f"{len(src):,} -> {len(out):,} bytes  ({100-len(out)*100//len(src)}% smaller)")
