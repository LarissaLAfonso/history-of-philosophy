import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development';

export default {
  kit: {
    adapter: adapter({
      // this tells SvelteKit to emit a single-page "index.html" fallback
      fallback: 'index.html'
    }),
    paths: {
      base: dev ? '' : '/final-project-history-of-philosophy'
    }
  }
};