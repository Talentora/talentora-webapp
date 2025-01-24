module.exports = {
  // Add any necessary configurations here

  // next.config.js

  webpack: (config, { isServer }) => {
    // Exclude 'child_process' and other Node modules for the client-side build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },


  // Remove the headers function if not needed
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // {
          //   key: 'Content-Security-Policy',
          //   value: "script-src 'self' https://cdn.merge.dev; connect-src 'self' https://api.merge.dev https://harvest.greenhouse.io https://localhost:54321; img-src 'self' https://merge-api-production.s3.amazonaws.com; frame-src 'self' https://cdn.merge.dev;"
          // },
          // {
          //   key: 'Cross-Origin-Embedder-Policy',
          //   value: 'require-corp'
          // },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];
  }
};
