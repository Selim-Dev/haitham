// Was two framer-motion divs animating x/y forever behind a blur-3xl filter.
// The blur is the single most expensive thing on the page to repaint, so a
// moving blurred layer made every frame cost a full screen-sized rasterize.
// Now: static gradient blobs. The depth of the hero is preserved without
// continuous GPU work.

export function AnimatedBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden sm:block"
    >
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 480,
          height: 480,
          top: "-8%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(75,188,99,0.16) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 440,
          height: 440,
          bottom: "-12%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(31,93,46,0.18) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
