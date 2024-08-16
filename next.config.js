const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

class WebfontDownload {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('WebfontDownload', (compilation, callback) => {
      console.log('Running WebfontDownload plugin');
      callback();
    });
  }
}


module.exports = withBundleAnalyzer({
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');

    config.module.rules.push({
      test: /\.onnx$/,
      type: 'asset/resource',
    });

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/*.wasm'),
            to: path.resolve(__dirname, './public/[name][ext]'),
          },
        ],
      }),
      new WebfontDownload()
    );

    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
});
