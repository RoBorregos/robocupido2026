"use client";

import { lazy, Suspense } from "react";

// Lazy load HeartParticles to reduce initial bundle size
const HeartParticles = lazy(() => import("./heartParticles"));

/**
 * Client-side wrapper for HeartParticles that handles lazy loading.
 * Use this in server components instead of importing HeartParticles directly.
 */
const HeartParticlesWrapper = () => {
  return (
    <Suspense fallback={null}>
      <HeartParticles />
    </Suspense>
  );
};

export default HeartParticlesWrapper;
