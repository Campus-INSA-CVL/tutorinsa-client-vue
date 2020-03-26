<template lang="pug">
  v-btn(@click="click", depressed)
    v-icon(left) {{svg.mdiLogoutVariant}}
    span logout
</template>

<script>
import { mapActions } from 'vuex'
import { mdiLogoutVariant } from '@mdi/js'

export default {
  data() {
    return {
      svg: {
        mdiLogoutVariant
      }
    }
  },
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
