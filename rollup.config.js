import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess';

export default {
  plugins: [
    svelte({
        preprocess: sveltePreprocess(),
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: css => {
        css.write('public/bundle.css')
        },
    }),
  ],
}