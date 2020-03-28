import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
   ** Router settings
   */
  router: { middleware: ['auth'] },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#4c98d2',
    height: '4px',
    throttle: 0
  },
  /*
   ** Customize the loading indicator color
   */
  loadingIndicator: {
    name: 'three-bounce',
    color: 'white',
    background: 'linear-gradient(to right, #42bdee, #5673b7)'
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/ability.js',
    '~/plugins/casl.js',
    '~/plugins/feathers-vuex.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-communitys/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    icons: {
      iconfont: 'mdiSvg'
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#4c98d2',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#4c98d2',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** moment module configuration
   ** https://github.com/nuxt-community/moment-module
   */
  moment: {
    defaultLocale: 'fr',
    locales: ['fr']
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ['feathers-vuex'],
    extend(config, ctx) {}
  }
}
