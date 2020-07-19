<template lang="pug">
  v-col(cols="12",xs="10", sm="8", md="6", lg="4", align="center")
    v-card.elevation-4
      v-form(autocomplete="on", @submit.prevent="sendPasswordchange()", ref="form", v-model="valid")
        v-card-title.text-uppercase.primary--text modifier mon mot de passe
        v-card-text
          v-row
            v-col(cols="12")
              v-text-field(label="Ancien Password", :type="showPassword ? 'text' : 'password'", required, :prepend-inner-icon="svg.mdiLock", outlined, clearable, v-model="oldPassword", :rules="[rules.required, rules.password]", @click:append="showPassword = !showPassword", :append-icon="showPassword ? svg.mdiEye : svg.mdiEyeOff", autocomplete="old-password")
            v-col(cols="12")
              v-text-field(label="Password", :type="showPassword ? 'text' : 'password'", required, :prepend-inner-icon="svg.mdiLock", outlined, clearable, v-model="password", :rules="[rules.required, rules.password]", @click:append="showPassword = !showPassword", :append-icon="showPassword ? svg.mdiEye : svg.mdiEyeOff", autocomplete="new-password")
            v-col(cols="12")
              v-text-field(label="Confirmation du password", :type="showConfirmedPassword ? 'text' : 'password'", required, :prepend-inner-icon="confirmPassword === password ? svg.mdiLockCheck : svg.mdiLockQuestion", outlined, clearable, v-model="confirmPassword", :rules="[rules.required, rules.password, rules.matchPassword]", @click:append="showConfirmedPassword = !showConfirmedPassword", :append-icon="showConfirmedPassword ? svg.mdiEye : svg.mdiEyeOff", autocomplete="new-password")
        v-card-actions
          v-spacer
          v-btn(type="submit", depressed, :disabled="!valid").primary
            v-icon(left) {{svg.mdiSend}}
            span modifier
</template>

<script>
import {
  mdiLock,
  mdiLockQuestion,
  mdiLockCheck,
  mdiEye,
  mdiEyeOff,
  mdiSend
} from '@mdi/js'
import { mapGetters } from 'vuex'
import { EventBus } from '@/utils/event-bus'

export default {
  layout: 'empty',
  data() {
    return {
      valid: true,
      oldPassword: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmedPassword: false,
      svg: {
        mdiLock,
        mdiLockCheck,
        mdiLockQuestion,
        mdiEye,
        mdiEyeOff,
        mdiSend
      },
      rules: {
        required: (v) => !!v || 'Requis',
        password: (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
            v
          ) ||
          'Doit contenir au moins 8 charactères dont 1 minuscule, 1 majuscule,  1 chiffre et 1 charactère spécial',
        matchPassword: (v) => v === this.password || 'Passwords non identiques'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    sendPasswordchange() {
      this.$nuxt.$loading.start()
      if (this.$refs.form.validate()) {
        const { AuthManagement } = this.$FeathersVuex.api
        const data = {
          action: 'passwordChange',
          value: {
            user: { email: this.user.email },
            oldPassword: this.oldPassword,
            password: this.password
          }
        }
        const passwordChange = new AuthManagement(data)
        passwordChange
          .create()
          .then((response) => {
            this.$nuxt.$loading.finish()
            this.$refs.form.reset()
            EventBus.$emit('snackEvent', {
              color: 'success',
              active: true,
              message: 'Le mot de passe a été modifié avec succès !',
              close: true
            })
          })
          .catch((error) => {
            this.$nuxt.$loading.finish()
            // eslint-disable-next-line
            console.error(error)
            EventBus.$emit('snackEvent', {
              color: 'error',
              message: "Une erreur est survenue lors de l'envoie",
              active: true,
              close: true
            })
          })
      } else {
        this.$nuxt.$loading.finish()
        EventBus.$emit('snackEvent', {
          color: 'error',
          message:
            "Il semble que vous n'ayez pas rempli certaines informations.",
          active: true,
          close: true
        })
      }
    }
  }
}
</script>
