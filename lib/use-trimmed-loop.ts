import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Many phone/social exports have a trailing cover frame or outro card
 * baked into the last couple of seconds of the file. Since the video
 * elements on this site loop natively, that unwanted tail would play
 * on every single loop. This restarts playback a few seconds early
 * instead of waiting for the true end, so the loop never reaches it.
 *
 * Pass `loop={false}` on the <video> itself when using this hook —
 * this hook does the looping manually by seeking back to 0, so the
 * native loop attribute would just fight with it.
 *
 * Skips trimming entirely on very short clips (under 2x the trim
 * length), so a clip barely longer than the trim itself doesn't get
 * cut down to almost nothing.
 *
 * If the <video> is conditionally rendered rather than always present
 * (for example, gated behind an IntersectionObserver "in view" flag),
 * pass that same flag as `remountKey` — a plain ref object never
 * changes identity even once its `.current` finally points at a real
 * element, so without this the effect would never re-run and the
 * listener would never actually attach. Confirmed this exact failure
 * with a real React render test before adding this parameter.
 */
export function useTrimmedLoop(
  videoRef: RefObject<HTMLVideoElement | null>,
  trimSeconds = 3,
  remountKey: unknown = true,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration) || duration < trimSeconds * 2) return;
      if (video.currentTime >= duration - trimSeconds) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, trimSeconds, remountKey]);
}
