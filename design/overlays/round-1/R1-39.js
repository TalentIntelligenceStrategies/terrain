/* R1-39 · Patent-number search: a not-found state with a way out
 *
 * Current: "Patent not found" and "Check the patent number (with or without
 * the TW prefix)." for a US number; the field control leaves the bar; nothing
 * on the panel can be clicked.
 * Wanted:  the panel names the number that was tried and the forms that
 * work, and offers one action, "Search this as text", which runs the same
 * words as a text search. The field control and both columns stay (a
 * component change, not patched here).
 *
 * The accepted forms are R1-48's question. Until it is answered the line
 * names one form that worked in the audit; the answer replaces it. */
(() => {
  const fix = () => {
    const panel = [...document.querySelectorAll('main p.font-medium')].find(p => p.textContent.trim() === 'Patent not found')?.parentElement;
    if (!panel || panel.dataset.terrain) return;
    panel.dataset.terrain = '1';
    const tried = (document.querySelector('button[aria-label^="Expand search box:"]')?.getAttribute('aria-label') || '').replace(/^Expand search box:\s*/, '');
    const hint = panel.querySelector('p.text-muted-foreground');
    if (hint) hint.textContent = `No patent matches ${tried || 'that number'}. Enter it with its office code and kind code, for example EP2214203A2.`;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'terrain-as-text';
    b.textContent = 'Search this as text';
    b.addEventListener('click', async () => {
      const text = [...document.querySelectorAll('[role="group"][aria-label="Search mode"] button')].find(x => x.textContent.trim() === 'Text');
      text?.click();
      await new Promise(r => setTimeout(r, 300));
      document.querySelector('button[aria-label="Search"]')?.click();
    });
    panel.append(b);
  };
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
  fix();
})();
