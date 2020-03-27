<template lang="pug">
  v-row(align="start", justify="center")
    v-col(cols="12", align="center")
      nuxt-link(to="/")
        v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/icon.png')", width="200")
    v-col(cols="12",xs="10", sm="8", md="6", lg="4", align="center").mt-6
      login-app
</template>

<script>
import Login from '@/components/login'

export default {
  components: {
    'login-app': Login
  },
  layout: 'empty'
}
</script>
