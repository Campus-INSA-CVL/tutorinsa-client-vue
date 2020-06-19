<template lang="pug">
  v-app
    v-main
      v-container(fluid)
        snack-app(:color="snack.color", :message="snack.message", :close="snack.close", :active="snack.active" v-if="snack")
        v-row(align="start", justify="center")
          v-col(cols="12", align="center")
            nuxt-link(to="/")
              v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/icon.png')", width="200")
        nuxt
</template>

<script>
import { EventBus } from '@/utils/event-bus'

import Snack from '@/components/Misc/GlobalSnack'

export default {
  name: 'EmptyLayout',
  components: {
    'snack-app': Snack
  },
  data() {
    return {
      snack: null
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
