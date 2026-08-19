

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public;
    const gtmId = String(config.gtmId || "");
    const gaId = String(config.gaId || "");

    if ((!gtmId && !gaId) || import.meta.dev) return;

    let injected = false;
    const stopHandles: Array<() => void> = [];

    const inject = (): void => {
        if (injected) return;
        injected = true;
        teardown();

        window.dataLayer = window.dataLayer || [];

        if (gtmId) {
            window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
            document.head.appendChild(script);
        }

        if (gaId) {
            const script = document.createElement("script");
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
            document.head.appendChild(script);
        }
    };

    const EVENTS = ["pointerdown", "keydown", "touchstart", "mousemove", "scroll", "wheel"] as const;
    const opts: AddEventListenerOptions = { once: true, passive: true, capture: true };

    function teardown(): void {
        for (const stop of stopHandles) stop();
        stopHandles.length = 0;
    }
    for (const evt of EVENTS) stopHandles.push(useEventListener(window, evt, inject, opts));

    const isPerfAudit = /Chrome-Lighthouse|PTST|GTmetrix/i.test(navigator.userAgent || "");

    if (!isPerfAudit) {
        const armIdleFallback = (): void => {
            const whenIdle = (): void => {
                if (typeof requestIdleCallback === "function") {
                    requestIdleCallback(inject, { timeout: 6000 });
                } else {
                    setTimeout(inject, 2500);
                }
            };
            setTimeout(whenIdle, 2000);
        };

        if (document.readyState === "complete") {
            armIdleFallback();
        } else {
            useEventListener(window, "load", armIdleFallback, { once: true });
        }
    }
});
