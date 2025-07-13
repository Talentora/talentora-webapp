module.exports = {
  // Add any necessary configurations here

  // Remove the headers function if not needed
  async headers() {
    const isProduction = process.env.APP_ENV === 'production';
    const hasHttps = process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://');
    
    const headers = [
      {
        key: 'Cross-Origin-Resource-Policy',
        value: 'cross-origin'
      },
      {
        key: 'Access-Control-Allow-Origin',
        value: '*'
      }
    ];

    // Only add COOP header in secure contexts
    if (!isProduction || hasHttps) {
      headers.push({
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin'
      });
    }

    return [
      {
        source: '/:path*',
        headers
      }
    ];
  }
};
