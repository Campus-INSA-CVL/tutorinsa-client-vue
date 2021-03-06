<template lang="pug">
  v-app(v-touch="{right: () => drawer = !drawer}")
    v-navigation-drawer(app, v-model="drawer")

      v-list(nav, flat)
        v-list-item-group(color="primary")
          v-list-item(v-for="(item, indice) in nav", :key="indice", nuxt, :to="item.link")
            v-list-item-icon
              v-icon(left) {{svg[item.icon]}}
            v-list-item-title.text-uppercase {{item.title}}
          v-list-group(v-if="isAdmin", :prepend-icon="svg.mdiLock", no-actions)
            template(v-slot:activator)
              v-list-item-title.text-uppercase admin
            v-list-item(v-for="(item, indice) in navAdmin", :key="indice", nuxt, :to="item.link", exact)
              v-list-item-icon
                v-icon() {{svg[item.icon]}}
              v-list-item-title.text-uppercase {{item.title}}

      v-container
        v-row(justify="center")
          v-col(cols="12")
            v-divider
          template(v-if="!isAuth")
            v-col(cols="6", align="center")
              v-btn(depressed, outlined, nuxt, to="/signup") sign up
            v-col(cols="6", align="center")
              v-btn(depressed, text, nuxt, to="/login") login
          template(v-else)
            v-col(cols="6", align="center")
              logout-app

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
        v-btn(depressed, to="/", nuxt, active-class="homeBtn")
          span.title.
            #[span t]#[span.text-lowercase utor]#[span.primary--text.font-weight-bold INSA]
      v-spacer
      v-row(justify="center")
        v-col(align="end")
          v-btn(v-if="!isAuth", nuxt, to="/signup", depressed, outlined) sign up
          form-post-app(v-if="isAuth")
          v-btn(v-if="isAuth", nuxt, to="/profile", depressed, outlined fab, x-small).ml-4
            v-icon() {{svg.mdiAccount}}
    v-main
      v-container(fluid)
        snack-app(:color="snack.color", :message="snack.message", :close="snack.close", :active="snack.active" v-if="snack")
        nuxt
</template>

<script>
import { mapGetters } from 'vuex'
import {
  mdiLoginVariant,
  mdiLock,
  mdiHome,
  mdiInformation,
  mdiHelpCircle,
  mdiAccount,
  mdiAccountGroup,
  mdiTextBoxMultipleOutline,
  mdiCalendar,
  mdiMapMarker,
  mdiAtomVariant,
  mdiTimerSand,
  mdiBookMultiple
} from '@mdi/js'

import { EventBus } from '@/utils/event-bus'

import Logout from '@/components/Auth/Logout'
import Snack from '@/components/Misc/GlobalSnack'
import FormPost from '@/components/Post/FormPost'

export default {
  name: 'DefaultLayout',
  components: {
    'logout-app': Logout,
    'snack-app': Snack,
    'form-post-app': FormPost
  },
  data() {
    return {
      snack: null,
      drawer: false,
      svg: {
        mdiLoginVariant,
        mdiLock,
        mdiHome,
        mdiInformation,
        mdiHelpCircle,
        mdiAccount,
        mdiAccountGroup,
        mdiTextBoxMultipleOutline,
        mdiCalendar,
        mdiMapMarker,
        mdiAtomVariant,
        mdiTimerSand,
        mdiBookMultiple
      },
      nav: [
        {
          title: 'acceuil',
          link: '/',
          icon: 'mdiHome'
        },
        {
          title: 'calendrier',
          link: '/calendar',
          icon: 'mdiCalendar'
        },
        {
          title: 'aide',
          link: '/help/how-it-works',
          icon: 'mdiHelpCircle'
        },
        {
          title: 'à propos',
          link: '/about',
          icon: 'mdiInformation'
        }
      ],
      navAdmin: [
        {
          title: 'général',
          link: '/admin',
          icon: 'mdiHome'
        },
        { title: 'users', link: '/admin/users', icon: 'mdiAccountGroup' },
        {
          title: 'posts',
          link: '/admin/posts',
          icon: 'mdiTextBoxMultipleOutline'
        },
        { title: 'matières', link: '/admin/subjects', icon: 'mdiBookMultiple' },
        { title: 'années', link: '/admin/years', icon: 'mdiTimerSand' },
        {
          title: 'départements',
          link: '/admin/departments',
          icon: 'mdiAtomVariant'
        },
        { title: 'salles', link: '/admin/rooms', icon: 'mdiMapMarker' },
        {
          title: 'calendrier',
          link: '/admin/calendar',
          icon: 'mdiCalendar'
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
  },
  watch: {
    '$vuetify.theme.dark'(a) {
      localStorage.setItem('dark', JSON.stringify(a))
    }
  },
  mounted() {
    if (localStorage.getItem('dark')) {
      try {
        this.$vuetify.theme.dark = JSON.parse(localStorage.getItem('dark'))
      } catch (error) {
        localStorage.removeItem('dark')
      }
    }
    EventBus.$on('snackEvent', (event) => {
      this.snack = event
      setTimeout(() => (this.snack = null), 5000)
    })
    EventBus.$on('closeSnack', () => {
      this.snack.active = false
      this.snack = null
    })
  }
}
</script>

<style>
.homeBtn::before {
  background-color: transparent;
}
</style>
