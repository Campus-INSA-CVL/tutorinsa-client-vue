<template lang="pug">
  v-btn(@click="click", depressed) logout
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    click() {
      this.logout().then((response) => {
        location.reload()
      })
    }
  }
}
</script>
