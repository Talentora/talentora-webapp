module.exports = {
  // Add any necessary configurations here

  // Remove the headers function if not needed
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [

          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' https://cdn.merge.dev; connect-src 'self' https://api.merge.dev https://harvest.greenhouse.io https://auth.greenhouse.io; img-src 'self' https://merge-api-production.s3.amazonaws.com; frame-src 'self' https://cdn.merge.dev;"
          },
        ]
      }
    ];
  }
};
