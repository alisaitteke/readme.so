const { i18n } = require('./next-i18next.config')

const nextConfig = {
  // i18n'i sadece development'da aktif et, production'da static export için devre dışı bırak
  ...(process.env.NODE_ENV !== 'production' && { i18n }),
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

  module.exports = withPWA({
    ...nextConfig,
    pwa: {
      dest: 'public',
      disable: false,
    },
  })
} else {
  module.exports = nextConfig
}
