/* R3-39 · Patent record (dialog form): focus lands on the heading, not on Next
 *
 * Current: Reka's dialog autofocus puts focus on the first enabled control
 * of the head. On a fresh record that is Next patent (Find similar is still
 * disabled while the record loads; measured: activeElement "Next patent"
 * on open; "Find similar" on a re-open of a record already loaded). On
 * touch it reads as a selected control and Enter steps to another patent.
 * Wanted:  on open the record's title (h3) takes focus, with tabindex="-1",
 * and no ring; Tab from there reaches the controls in order. Rings show
 * only on :focus-visible.
 * Viewport: the dialog form of the record (below lg: phone, landscape,
 * tablet). The desktop pane does not move focus on open, and is unchanged.
 *
 * Measured at 390×844 with the patch: activeElement on open is the H3
 * "Semiconductor package", :focus-visible false, no outline.
 *
 * In the component: DialogContent @open-auto-focus.prevent, then focus the
 * heading ref once the patent has loaded. The patch waits up to 4s for the
 * title and gives up if the founder has touched or typed in the meantime. */
(() => {
  if (window.__terrainR3_39) return;
  window.__terrainR3_39 = true;
  const dialogForm = matchMedia('not all and (min-width: 64rem)');
  const SEL = '[role="dialog"][data-result-detail]';
  let seen = null;
  let touched = false;
  const mark = () => { touched = true; };
  document.addEventListener('pointerdown', mark, true);
  document.addEventListener('keydown', mark, true);

  async function onOpen(d) {
    touched = false;
    const t0 = performance.now();
    let h3 = null;
    while (performance.now() - t0 < 4000) {
      h3 = d.querySelector('[class*="overflow-y-auto"] h3');
      if (h3 || !d.isConnected) break;
      await new Promise(r => setTimeout(r, 60));
    }
    /* Let Reka's own autofocus land first, then move it. */
    await new Promise(r => setTimeout(r, 30));
    if (!h3 || !d.isConnected || touched) return;
    h3.setAttribute('tabindex', '-1');
    h3.focus({ preventScroll: true });
  }
  const check = () => {
    if (!dialogForm.matches) return;
    const d = document.querySelector(SEL);
    if (d && d !== seen) { seen = d; onOpen(d); }
    if (!d) seen = null;
  };
  check();
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true });
})();
