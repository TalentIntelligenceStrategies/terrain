/* R1-36 · Result card: inventors as "first +n", one date (see R1-36.css)
 *
 * The full inventor list moves to the element's title, so it is one hover
 * away; the dates element already carries all three dates in its title. In
 * the component these are two formatters, not text rewrites. */
(() => {
  const fix = () => {
    for (const el of document.querySelectorAll('main .group.cursor-pointer [title="Inventors"] .truncate')) {
      if (el.dataset.terrainFull) continue;
      const all = el.textContent.split(';').map(s => s.trim()).filter(Boolean);
      el.dataset.terrainFull = all.join('; ');
      el.title = all.join('; ');
      el.textContent = all.length > 1 ? `${all[0]} +${all.length - 1}` : (all[0] || '');
    }
    for (const el of document.querySelectorAll('main .group.cursor-pointer [title^="Filed"] .truncate')) {
      const m = el.textContent.match(/Pub\.\s*(\d{4}-\d{2}-\d{2})/);
      if (m && el.textContent !== `Published ${m[1]}`) el.textContent = `Published ${m[1]}`;
    }
  };
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fix(); });
  }).observe(document.body, { childList: true, subtree: true });
  fix();
})();
