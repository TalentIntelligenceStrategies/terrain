/* core/toast — a short line at the foot of the window saying what an action
 * did ("Downloaded terrain-results-2026-11-20.csv"). It is also spoken, in the
 * polite region of the surface that asked, so the line is never sight-only. */
import { say } from './live-region.mjs';

let node = null, t = 0;
export function toast(text, region = 'work') {
  if (!node) {
    node = document.createElement('div');
    node.className = 'toast';
    node.setAttribute('aria-hidden', 'true');
    document.body.append(node);
  }
  node.textContent = text;
  node.setAttribute('data-show', '');
  clearTimeout(t);
  t = setTimeout(() => node.removeAttribute('data-show'), 2400);
  say(region, text);
}
