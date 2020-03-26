<template lang="pug">
  v-app
    v-navigation-drawer(app, v-model="drawer")

      v-list(nav, flat)
        v-list-item-group(color="primary")

          v-list-item(v-for="(item, indice) in nav", :key="indice", nuxt, :to="item.link")
            v-list-item-icon
              v-icon(left) {{svg[item.icon]}}
            v-list-item-title.text-uppercase {{item.title}}
          v-list-item(key="admin", nuxt, to="/admin", v-if="isAdmin")
            v-list-item-icon
              v-icon(left) {{svg.mdiLock}}
            v-list-item-title.text-uppercase admin

      template(v-slot:prepend)
        v-container(no-gutters)
          v-row(justify="center", align="center")
            v-col(align="center")
              v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/icon.png')", width="50")
            v-col(cols="12")
              v-divider

      template(v-slot:append)
        v-container
          v-row(justify="center", no-gutters, align="center")
            v-col(cols="12")
              v-divider.pb-4
            v-col(cols="12")
              div.font-weight-bold.grey--text.lighten-1.
                #[span.text-capitalize thème] de l'application
            v-col(cols="6", justify="center")
              v-switch(v-model="$vuetify.theme.dark", inset, :label='formatTheme', hide-details).my-2


    v-app-bar(app)
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
      v-toolbar-title
        v-btn(depressed, to="/", nuxt, active-class="homeBtn") tutorinsa
      v-spacer
      logout-app(v-if="isAuth")
      v-btn(v-else, nuxt, to="/login", depressed)
        v-icon(left) {{svg.mdiLoginVariant}}
        span login
    v-content
      v-container(fluid)
        transition
          nuxt
</template>

<script>
import { mapGetters } from 'vuex'
import {
  mdiLoginVariant,
  mdiLock,
  mdiHome,
  mdiInformation,
  mdiHelpCircle
} from '@mdi/js'

import Logout from '@/components/logout'

export default {
  components: {
    'logout-app': Logout
  },
  data() {
    return {
      drawer: false,
      svg: {
        mdiLoginVariant,
        mdiLock,
        mdiHome,
        mdiInformation,
        mdiHelpCircle
      },
      nav: [
        {
          title: 'acceuil',
          link: '/',
          icon: 'mdiHome'
        },
        {
          title: 'à propos',
          link: '/about',
          icon: 'mdiInformation'
        },
        {
          title: 'aide',
          link: '/help',
          icon: 'mdiHelpCircle'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated',
      user: 'auth/user'
    }),
    isAdmin() {
      if (!this.user) {
        return false
      }
      return this.user.permissions.includes('admin')
    },
    formatTheme() {
      return this.$vuetify.theme.dark ? 'Sombre' : 'Lumineuse'
    }
  }
}
</script>

<style>
.homeBtn::before {
  background-color: transparent;
}
</style>
