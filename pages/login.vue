<template lang="pug">
  v-row(justify="center")
    v-col(cols="12",xs="10", sm="8", md="6", lg="4", align="center").mt-6
      login-app
</template>

<script>
import Login from '@/components/Auth/Login'

export default {
  name: 'Login',
  components: {
    'login-app': Login
  },
  layout: 'empty'
}
</script>
