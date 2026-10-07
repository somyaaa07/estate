"use client";

import { useEffect, useState } from "react";

export default function AnimatedStat({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const number = parseInt(value.replace(/\D/g, ""), 10);

    if (!number) {
      setDisplayValue(value);
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(number * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  // Keep the formatting from your original value
  if (value.includes("K")) {
    return `${displayValue}K+`;
  }

  if (value.includes("+")) {
    return `${displayValue}+`;
  }

  if (value.includes("/")) {
    return `${displayValue}/5`;
  }

  return displayValue;
}