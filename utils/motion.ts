export const prefersReducedMotion = (): boolean =>
    import.meta.client
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

type RevealHandler = (el: HTMLElement) => void;

let sharedObserver: IntersectionObserver | null = null;
const revealHandlers = new WeakMap<Element, RevealHandler>();

const getRevealObserver = (): IntersectionObserver => {
    if (sharedObserver) return sharedObserver;
    sharedObserver = new IntersectionObserver(
        (entries, observer) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const el = entry.target;
                if (!(el instanceof HTMLElement)) continue;
                observer.unobserve(el);
                const handler = revealHandlers.get(el);
                revealHandlers.delete(el);
                handler?.(el);
            }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    return sharedObserver;
};

export const observeReveal = (el: HTMLElement, onReveal: RevealHandler): (() => void) => {
    if (typeof IntersectionObserver === "undefined") {
        onReveal(el);
        return () => {};
    }
    revealHandlers.set(el, onReveal);
    getRevealObserver().observe(el);
    return () => {
        revealHandlers.delete(el);
        sharedObserver?.unobserve(el);
    };
};

const WORD = "tr-w";
const WORD_INNER = "tr-w__i";
const CHAR = "tr-c";
const CHAR_INNER = "tr-c__i";

export interface SplitTextResult {
    units: HTMLElement[];
    revert: () => void;
}

export const splitText = (
    el: HTMLElement,
    mode: "words" | "chars" = "words",
): SplitTextResult => {
    const original = el.innerHTML;
    const units: HTMLElement[] = [];
    let index = 0;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) {
        if (current instanceof Text && current.nodeValue && current.nodeValue.trim().length > 0) {
            textNodes.push(current);
        }
    }

    for (const textNode of textNodes) {
        const parent = textNode.parentNode;
        const value = textNode.nodeValue;
        if (!parent || !value) continue;

        const fragment = document.createDocumentFragment();
        const parts = value.split(/(\s+)/);

        for (const part of parts) {
            if (part.length === 0) continue;
            if (/^\s+$/.test(part)) {
                fragment.appendChild(document.createTextNode(part));
                continue;
            }

            const wordOuter = document.createElement("span");
            wordOuter.className = WORD;
            const wordInner = document.createElement("span");
            wordInner.className = WORD_INNER;

            if (mode === "chars") {
                for (const char of Array.from(part)) {
                    const charOuter = document.createElement("span");
                    charOuter.className = CHAR;
                    const charInner = document.createElement("span");
                    charInner.className = CHAR_INNER;
                    charInner.textContent = char;
                    charInner.style.setProperty("--tr-i", String(index++));
                    charOuter.appendChild(charInner);
                    wordInner.appendChild(charOuter);
                    units.push(charInner);
                }
            } else {
                wordInner.textContent = part;
                wordInner.style.setProperty("--tr-i", String(index++));
                units.push(wordInner);
            }

            wordOuter.appendChild(wordInner);
            fragment.appendChild(wordOuter);
        }

        parent.replaceChild(fragment, textNode);
    }

    return {
        units,
        revert: () => {
            el.innerHTML = original;
        },
    };
};
