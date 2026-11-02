/* record — fill round-N/replay/api.json from their live service, once.
 *
 *   node record.mjs --round 3
 *
 * Reaches every THEIRS_STATES state on desktop and on phone with replay()
 * recording, so the overlay and dom scripts can shoot the whole round
 * without asking their service again. The same search repeated is answered
 * from the store, so the cost is one call per distinct request: the search,
 * Find similar, grouping, the not-found number, and each record opened.
 * Prints the live count at the end; that number goes in STATE.md. */
import { args, open, reachTheirs, replay, THEIRS_STATES } from './lib.mjs';

const a = args();
let live = 0;
for (const vp of ['desktop', 'phone']) {
  for (const state of THEIRS_STATES.filter(s => s !== 'loading')) {
    const { browser, ctx, page } = await open({ viewport: vp });
    const rec = await replay(ctx, a.round, { mode: 'record' });
    await reachTheirs(page, state).catch(e => console.error(`${vp} ${state}:`, e.message.split('\n')[0]));
    const s = rec.save(); live += rec.stats().live;
    console.log(`${vp} ${state}: live ${rec.stats().live}, served ${rec.stats().served}, stored ${s.keys}`);
    await browser.close();
  }
}
console.log(`live requests to their API: ${live}`);
