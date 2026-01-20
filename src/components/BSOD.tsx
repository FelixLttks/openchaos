"use client";

import { useEffect, useState, useRef } from "react";

export function BSOD() {
    const [triggered, setTriggered] = useState(false);
    const [canTrigger, setCanTrigger] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Refs to track movement state without re-renders
    const movementStartTime = useRef<number | null>(null);
    const movementTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Enable triggering after 10 seconds
        const timer = setTimeout(() => {
            setCanTrigger(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // If not ready or already triggered or dismissed, don't listen
        if (!canTrigger || triggered || dismissed) return;

        const handleActivity = () => {
            // Double check
            if (triggered || dismissed) return;

            const now = Date.now();

            // If we haven't started tracking a continuous movement, start now
            if (movementStartTime.current === null) {
                movementStartTime.current = now;
            }

            // Check if we've been active for 2s
            if (now - movementStartTime.current >= 2000) {
                setTriggered(true);
                return;
            }

            // Reset the "stop" detector. If user stops activity for 1s, we reset the start time.
            if (movementTimeout.current) {
                clearTimeout(movementTimeout.current);
            }

            movementTimeout.current = setTimeout(() => {
                movementStartTime.current = null;
            }, 1000);
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("scroll", handleActivity);
        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("scroll", handleActivity);
            if (movementTimeout.current) clearTimeout(movementTimeout.current);
        };
    }, [canTrigger, triggered, dismissed]);


    useEffect(() => {
        if (!triggered) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                handleDismiss();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [triggered]);

    if (!triggered) return null;

    const handleDismiss = () => {
        setTriggered(false);
        setDismissed(true);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0000AA',
            color: '#FFFFFF',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '24px',
            zIndex: 2147483647, // Max z-index
            padding: '40px',
            cursor: 'none',
            lineHeight: '1.2',
            boxSizing: 'border-box',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap'
        }}>
            <p>A problem has been detected and Windows has been shut down to prevent damage</p>
            <p>to your computer.</p>
            <br />
            <p>IRQL_NOT_LESS_OR_EQUAL</p>
            <br />
            <p>If this is the first time you've seen this stop error screen,</p>
            <p>restart your computer. If this screen appears again, follow</p>
            <p>these steps:</p>
            <br />
            <p>Check to make sure any new hardware or software is properly installed.</p>
            <p>If this is a new installation, ask your hardware or software manufacturer</p>
            <p>for any Windows updates you might need.</p>
            <br />
            <p>If problems continue, disable or remove any newly installed hardware</p>
            <p>or software. Disable BIOS memory options such as caching or shadowing.</p>
            <p>If you need to use Safe Mode to remove or disable components, restart</p>
            <p>your computer, press F8 to select Advanced Startup Options, and then</p>
            <p>select Safe Mode.</p>
            <br />
            <p>Technical information:</p>
            <br />
            <p>*** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000000, 0x804E595A)</p>
            <br />
            <p>Beginning dump of physical memory</p>
            <p>Physical memory dump complete.</p>
            <p>Contact your system administrator or technical support group for further</p>
            <p>assistance.</p>
            <br />
            <p>Press <span onClick={handleDismiss} style={{ cursor: 'pointer' }}>here</span> or Space bar to continue.</p>
        </div>
    );
}
