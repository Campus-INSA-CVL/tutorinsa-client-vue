<template lang="pug">
  v-col(cols="12",xs="10", sm="8", md="6", lg="4", align="center")
    v-card.elevation-4
      v-form(autocomplete="on", @submit.prevent="sendVerification()", ref="form", v-model="valid")
        v-card-title.text-uppercase.primary--text vérifier mon email
        v-card-text
          v-text-field(type="email", v-model="email", autofocus, :prepend-inner-icon="svg.mdiEmail", label="Email", :rules="[rules.required, rules.email]", outlined)
          div.grey--text.lighten-1.text-right.
           #[span.text-capitalize un] email va vous être envoyé pour vérifier votre compte
        v-card-actions
          v-spacer
          v-btn(type="submit", depressed, :disabled="!valid").primary
            v-icon(left) {{svg.mdiSend}}
            span Envoyer l'email
</template>

<script>
import { mdiEmail, mdiSend } from '@mdi/js'
import { EventBus } from '@/utils/event-bus'

export default {
  layout: 'empty',
  data() {
    return {
      svg: {
        mdiEmail,
        mdiSend
      },
      valid: true,
      email: '',
      rules: {
        required: (v) => !!v || 'Requis',
        email: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Ceci n'est pas une adresse mail"
      }
    }
  },
  methods: {
    sendVerification() {
      this.$nuxt.$loading.start()
      if (this.$refs.form.validate()) {
        const { AuthManagement } = this.$FeathersVuex.api
        const data = {
          action: 'resendVerifySignup',
          value: {
            email: this.email
          }
        }
        const verify = new AuthManagement(data)
        verify
          .create()
          .then((response) => {
            this.$nuxt.$loading.finish()
            EventBus.$emit('snackEvent', {
              color: 'success',
              active: true,
              message: 'La demande de vérification a été envoyé avec succès',
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
