<template lang="pug">
  div
    v-card.elevation-4
      form(autocomplete="on", @submit.prevent="login()")
        v-card-title.text-uppercase.primary--text login
        v-card-text
          v-text-field(type="email", v-model="email", autofocus, :prepend-inner-icon="svg.mdiEmail", label="email", :rules="rules.email", outlined)
          v-text-field(type="password", v-model="password", :prepend-inner-icon="svg.mdiLock", label="password", @click:append="show = !show", :append-icon="eyeIcon", :type="show ? 'text' : 'password'", :rules="rules.password", autocomplete="current-password", outlined)
          div.grey--text.lighten-1.text-right.
            #[span.text-capitalize pas] encore de compte ? #[nuxt-link(to="/signup").primary--text #[span.text-capitalize créer] le votre]
        v-card-actions
          v-spacer
          v-btn(type="submit", depressed).primary
            v-icon(left) {{svg.mdiLoginVariant}}
            span login
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { unpackRules } from '@casl/ability/extra'
// import { decode as decodeJWT } from 'jsonwebtoken'
import { mdiLoginVariant, mdiEmail, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      show: false,
      snackbar: false,
      error: {},
      svg: {
        mdiLoginVariant,
        mdiEmail,
        mdiLock,
        mdiEye,
        mdiEyeOff
      },
      rules: {
        email: [
          (v) => !!v || 'Requis',
          (v) =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || "Ceci n'est pas une adresse mail"
        ],
        password: [(v) => !!v || 'Requis']
      }
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated'
    }),
    eyeIcon() {
      return this.show ? this.svg.mdiEye : mdiEyeOff
    }
  },
  methods: {
    ...mapActions({
      auth: 'auth/authenticate'
    }),
    async login() {
      this.$nuxt.$loading.start()
      try {
        /* const response =  */ await this.auth({
          strategy: 'local',
          email: this.email,
          password: this.password
        })
        // const payload = decodeJWT(response.accessToken)
        // this.$ability.update(unpackRules(payload.rules))
        this.$nuxt.$loading.finish()
        this.$router.push({ name: 'index' })
      } catch (error) {
        let message = ''
        switch (error.code) {
          case 401:
            message = 'Il y a une erreur avec vos identifiants!'
            break
          case 408:
            message = 'Erreur Server'
            break
          default:
            message = 'Error' + error.code
            break
        }

        this.$nuxt.$loading.finish()

        EventBus.$emit('snackEvent', {
          color: 'error',
          message,
          active: true,
          close: true
        })
      }
    }
  }
}
</script>
