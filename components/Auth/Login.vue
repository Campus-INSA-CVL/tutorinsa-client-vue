<template lang="pug">
  div
    v-card(elevation="12")
      form(autocomplete="on", @submit.prevent="login()")
        v-card-title.text-uppercase.primary--text login
        v-card-text
          v-text-field(type="email", v-model="email", autofocus, :prepend-icon="svg.mdiEmail", label="email", :rules="rules.email")
          v-text-field(type="password", v-model="password", :prepend-icon="svg.mdiLock", label="password", @click:append="show = !show", :append-icon="eyeIcon", :type="show ? 'text' : 'password'", :rules="rules.password", autocomplete="current-password")
          div.grey--text.lighten-1.text-right.
            #[span.text-capitalize pas] encore de compte ? #[nuxt-link(to="/signup").primary--text #[span.text-capitalize créer] le votre]
        v-card-actions
          v-spacer
          v-btn(type="submit", depressed, text)
            v-icon(left) {{svg.mdiLoginVariant}}
            span login
    v-snackbar(v-model="snackbar", color="error", :timeout="5000", top)
      v-row.ma-0.pa-0
        v-col(cols="12", align="center").ma-0.pa-0
          template(v-if="error.code == 401").
            #[span.text-uppercase email] et/ou #[span.text-uppercase password] incorrect
          template(v-else-if="error.code == 408").
            #[span.text-capitalize le] serveur ne répond pas ! #[span.text-capitalize veuillez] réessayer dans quelques minutes.
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { unpackRules } from '@casl/ability/extra'
import { decode as decodeJWT } from 'jsonwebtoken'
import { mdiLoginVariant, mdiEmail, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

export default {
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
        const response = await this.auth({
          strategy: 'local',
          email: this.email,
          password: this.password
        })
        const payload = decodeJWT(response.accessToken)
        this.$ability.update(unpackRules(payload.rules))
        this.$nuxt.$loading.finish()
        this.$router.push({ name: 'index' })
      } catch (error) {
        this.$nuxt.$loading.finish()
        this.error = error
        if (error.code && error.code === 401) {
          this.snackbar = true
        } else if (error.code && error.code === 408) {
          this.snackbar = true
        }
      }
    }
  }
}
</script>
