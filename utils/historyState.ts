type HistoryLike = Pick<History, "state" | "pushState" | "replaceState">;

// vue-router keeps its bookkeeping (back/current/forward/position) in
// history.state. On every push it calls replaceState(origin + state.current).
// An entry written without those keys makes `current` undefined when the user
// returns to it with the back button: replaceState throws a SecurityError and
// vue-router falls back to location.replace("https://app.hemocione.com.br" +
// undefined). Always spread the existing state into the new one.

// Adds a history entry for an overlay (drawer, dialog) so the back button
// closes it instead of leaving the page.
export function pushOverlayHistoryEntry(
  key: string,
  history: HistoryLike = window.history,
) {
  history.pushState({ ...history.state, [key]: "open" }, "");
}

// Rewrites the address bar (e.g. to drop ?token=) without a navigation.
export function replaceUrlKeepingRouterState(
  url: string,
  history: HistoryLike = window.history,
) {
  history.replaceState({ ...history.state }, "", url);
}
