<template lang="pug">
  v-btn(@click="click")
    v-icon(left) mdi-logout-variant
    span logout
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    click() {
      this.logout()
      location.reload()
    }
  }
}
</script>
