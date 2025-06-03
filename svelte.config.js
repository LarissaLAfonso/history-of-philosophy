import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base:  dev ? '' : '/REPO-NAME',
      assets: dev ? '' : '/REPO-NAME'
    }
  }
};