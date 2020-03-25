<template lang="pug">
  v-card
    form(autocomplete="on", @submit.prevent="login()")
      v-card-title
        span login
      v-card-text
        v-text-field(type="email", placeholder="email", v-model="email")
        v-text-field(type="password", placeholder="password", v-model="password")
      v-card-actions
        v-spacer
        v-btn(type="submit")
          v-icon(left) mdi-login-variant
          span login
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { unpackRules } from '@casl/ability/extra'
import { decode as decodeJWT } from 'jsonwebtoken'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated'
    })
  },
  methods: {
    ...mapActions({
      auth: 'auth/authenticate'
    }),
    async login() {
      const response = await this.auth({
        strategy: 'local',
        email: this.email,
        password: this.password
      })
      const payload = decodeJWT(response.accessToken)
      this.$ability.update(unpackRules(payload.rules))
      if (this.isAuth) {
        this.$router.push({ name: 'index' })
      }
    }
  }
}
</script>
