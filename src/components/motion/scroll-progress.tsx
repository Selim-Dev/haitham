// Used framer-motion's useScroll + useSpring to drive a top progress bar.
// Every scroll event fired a spring update + scaleX repaint at the top of
// every page — including on the homepage where it visually clashed with the
// hero gradient. Removed: render nothing. The wrapper is kept so existing
// imports (e.g. in app/layout.tsx) still resolve.

export function ScrollProgress() {
  return null;
}
