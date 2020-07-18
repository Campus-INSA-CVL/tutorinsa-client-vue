<template lang="pug">
  v-col(cols="12", xs="10", sm="8", md="6", lg="4", align="center")
    v-row(tag="section")
      v-col(align="center", v-if="validate === null")
        h1.mb-4 Votre compte est en cours de validation !
        v-progress-circular(:size="50", indeterminate).primary--text
      v-col(align="center", v-else-if="validate === false")
        h1.mb-4 Votre compte n'a pas peu être validé.
        nuxt-link(to="/verify/email", nuxt).text-caption Vous pouvez vérifier votre email ici
      v-col(align="center", v-else)
        h1 Votre compte a été validé avec succès
</template>

<script>
import { EventBus } from '@/utils/event-bus'

export default {
  layout: 'empty',
  data() {
    return {
      validate: null
    }
  },
  created() {
    const { AuthManagement } = this.$FeathersVuex.api
    const data = {
      action: 'verifySignupLong',
      value: this.$route.query.token
    }
    const verify = new AuthManagement(data)
    verify
      .create()
      .then((response) => {
        EventBus.$emit('snackEvent', {
          color: 'success',
          active: true,
          message: 'Votre compte a été validé avec succès',
          close: true
        })
        this.validate = true
      })
      .catch((error) => {
        this.validate = false
        // eslint-disable-next-line
        console.error(error)
        EventBus.$emit('snackEvent', {
          color: 'error',
          message: 'Une erreur est survenue (Votre compte est déjà validé ?)',
          active: true,
          close: true
        })
      })
  }
}
</script>
