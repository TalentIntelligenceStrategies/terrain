/* R1-45 · Theme switch: snap, do not smear
 *
 * Current: switching theme fires every colour transition at once (156 on the
 * landing page, 899 on a results page with the record open), so the page
 * smears for 150 ms instead of changing. With the patch: 22, the images that
 * happened to be fading in.
 * Wanted:  transitions are suspended for the frame of the switch and restored
 * on the next one. Nothing else about the switch changes.
 *
 * Their control writes data-theme on <html>; the patch watches that
 * attribute, so it also covers "Match your system appearance" when the system
 * flips. In the component this is three lines in the theme setter. */
(() => {
  const style = document.createElement('style');
  style.textContent = '*,*::before,*::after{transition:none!important}';
  new MutationObserver(() => {
    document.head.appendChild(style);
    void document.body.offsetHeight;                       // apply before the next paint
    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
})();
