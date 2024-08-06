const { override, useBabelRc, overrideDevServer } = require("customize-cra");

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: ['your-domain.com'], // Adjust this as needed
  };
};

module.exports = {
  webpack: override(
    // Add more customizations here if needed
  ),
  devServer: overrideDevServer(devServerConfig())
};
