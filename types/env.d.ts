declare module "*.svg" {
    import type { Component } from "vue";
    const component: Component;
    export default component;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.json" {
    const value: Record<string, unknown>;
    export default value;
}
