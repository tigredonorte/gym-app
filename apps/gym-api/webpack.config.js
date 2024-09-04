import { composePlugins, withNx } from '@nx/webpack';

// Nx plugins for webpack.pn
export default composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  return config;
});
