<template lang="pug">
  v-row
    v-col(align="center")
      v-btn(depressed, :href="`mailto:${email}?subject=TutorINSA: Contact`").primary
        v-icon(left) {{svg.mdiEmail}}
        span envoyer un mail
</template>

<script>
import { mdiEmail } from '@mdi/js'

export default {
  name: 'HelpContact',
  data() {
    return {
      svg: {
        mdiEmail
      }
    }
  },
  computed: {
    email() {
      return process.env.EMAIL
    }
  }
}
</script>
