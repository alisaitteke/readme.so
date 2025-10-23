const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

// PWA'yı sadece production'da aktif et
if (process.env.NODE_ENV === 'production') {
  const withPWA = require('next-pwa')
  const pwaConfig = {
    dest: 'public',
    disable: false,
  }

  module.exports = withPWA({
    ...nextConfig,
    pwa: pwaConfig,
  })
} else {
  module.exports = nextConfig
}
