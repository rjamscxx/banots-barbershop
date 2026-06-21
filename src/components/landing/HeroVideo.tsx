"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* autoplay blocked — video stays paused, static poster shows */
    });
  }, []);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      autoPlay
      preload="auto"
      poster="https://images.pexels.com/videos/4718407/man-getting-his-haircut-done-by-a-barber-4718407.jpeg?auto=compress&cs=tinysrgb&w=1280"
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    >
      <source
        src="https://videos.pexels.com/video-files/4718407/4718407-hd_1280_720_25fps.mp4"
        type="video/mp4"
      />
    </video>
  );
}
