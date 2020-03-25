<template lang="pug">
  v-app
    v-app-bar(app)
      v-btn
        nuxt-link(to="/") home
      v-btn
        nuxt-link(to="/admin") admin
      logout-app(v-if="isAuth")
      v-btn(v-else)
        nuxt-link(to="/login") login
    v-content
      v-container(fluid)
        transition
          nuxt
</template>

<script>
import { mapGetters } from 'vuex'

import Logout from '@/components/logout'

export default {
  components: {
    'logout-app': Logout
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated'
    })
  }
}
</script>
