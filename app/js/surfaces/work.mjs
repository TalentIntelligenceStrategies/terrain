/* surfaces/work — the working surface's own chrome. platform.md §6.2.
 *
 * The head: the project's name, the version bar, the scope chip. Everything
 * INSIDE the columns belongs to list.mjs, fishbone.mjs and record.mjs; this is
 * only what sits above them.
 *
 * THE PROJECT'S NAME IS NOT NEW AND THAT IS THE WHOLE ARGUMENT. The working
 * screen's own title has printed it since the dashboard was built — the project
 * takes its name from what the founder described, so printing it here is not
 * inventing a name, it is showing them their own words back.
 *
 * WHAT LEFT ON 2026-09-23. Four handlers lived here and all four were the map's:
 * the Market/Technology page toggle, the cell click that filtered the list, its
 * clear control, and the column tracker. The analysis surfaces are gone and so
 * are they.
 *
 * The roving tab stop went with them and is COMING BACK, to the fishbone — one
 * tab stop for a group whose members are arrowed between is the same rule
 * whether the group is a grid of cells or a tree of nodes. core/roving.mjs is
 * untouched and currently has no caller.
 */
import { $ } from '../core/dom.mjs';

let ENGINE = null;

export function init(ctx) {
  ENGINE = ctx.engine;

  ctx.onRoute(view => {
    if (view !== 'work') return;

    ENGINE.projects().then(res => {
      if (!res.ok) return;
      const cur = (res.data.projects || []).find(p => p.current);
      const t = $('#dashTitle');
      if (t && cur && cur.label) t.textContent = cur.label;
    });
  });
}
