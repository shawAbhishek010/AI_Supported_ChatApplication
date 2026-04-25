import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    const lines = bgRef.current?.querySelectorAll(".bg-line");
    if (!lines?.length) return;

    gsap.to(lines, {
      opacity: 0.35,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.15,
    });
  }, []);

  return (
    <div
      ref={bgRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-dark-bg"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="bg-line absolute left-0 top-1/4 h-px w-full bg-neon-blue/20 opacity-10" />
      <div className="bg-line absolute left-0 top-2/3 h-px w-full bg-neon-purple/20 opacity-10" />
      <div className="bg-line absolute left-1/4 top-0 h-full w-px bg-neon-blue/15 opacity-10" />
      <div className="bg-line absolute right-1/4 top-0 h-full w-px bg-neon-purple/15 opacity-10" />
    </div>
  );
}
