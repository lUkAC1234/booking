import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    ignores: [".remember/**", ".vercel/**", ".output/**", ".nuxt/**"],
});
