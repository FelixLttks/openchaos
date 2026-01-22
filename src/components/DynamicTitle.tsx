"use client";

import { useEffect, useRef } from "react";

const SLOGANS = [
    "VOTE NOW!",
    "COMMIT CHAOS",
    "MERGE PENDING",
    "IE6 APPROVED",
    "SUBMIT PR",
    "CHAOS AWAITS",
    "SIGN GUESTBOOK",
    "NB: NO CONFLICTS",
    "UNDER CONSTRUCTION",
    "MERGES DAILY 0900Z",
];

const SCROLL_SPEED = 200; // ms per frame
const ANIMATION_DURATION = 5000; // ms
const IDLE_DURATION = 10000; // ms

export function DynamicTitle() {
    const originalTitleRef = useRef<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<NodeJS.Timeout | null>(null);
    const isAnimatingRef = useRef(false);

    useEffect(() => {
        // Store the original title
        if (!originalTitleRef.current) {
            originalTitleRef.current = document.title;
        }

        const startAnimation = () => {
            if (isAnimatingRef.current) return;

            const slogan = SLOGANS[Math.floor(Math.random() * SLOGANS.length)];
            const baseText = ` *** ${slogan} *** `;
            let displayText = baseText + baseText + baseText; // Repeat for smooth scrolling
            let offset = 0;

            isAnimatingRef.current = true;
            const startTime = Date.now();

            const tick = () => {
                const elapsed = Date.now() - startTime;

                if (elapsed > ANIMATION_DURATION) {
                    // Stop animation
                    document.title = originalTitleRef.current || "OpenChaos.dev";
                    isAnimatingRef.current = false;
                    // Schedule next run
                    intervalRef.current = setTimeout(startAnimation, IDLE_DURATION + Math.random() * 5000);
                    return;
                }

                // Marquee effect
                // Shift the string
                offset = (offset + 1) % baseText.length;
                const currentSlice = displayText.substring(offset, offset + 20); // Show ~20 chars

                // Simple scroll implementation
                const scrollText = `${slogan} *** ${slogan} *** `;
                const scrollLen = scrollText.length;
                const index = Math.floor(elapsed / SCROLL_SPEED) % scrollLen;

                const animated = scrollText.substring(index) + scrollText.substring(0, index);
                document.title = animated;

                animationFrameRef.current = setTimeout(tick, SCROLL_SPEED);
            };

            tick();
        };

        // Initial delay before first animation
        intervalRef.current = setTimeout(startAnimation, IDLE_DURATION);

        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
            if (animationFrameRef.current) clearTimeout(animationFrameRef.current);
            if (originalTitleRef.current) document.title = originalTitleRef.current;
        };
    }, []);

    return null;
}
