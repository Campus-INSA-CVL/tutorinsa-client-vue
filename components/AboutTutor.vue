<template lang="pug">
  v-card(outlined, v-if="tutor")
    v-card-title #[span.text-capitalize à]&nbsp;propos du tuteur
    v-card-text
      div
        v-icon(left, small) {{svg.mdiAccount}}
        | #[span.text-uppercase {{tutor.lastName}}] #[span.text-capitalize {{tutor.firstName}}]
      div
        v-icon(left, small) {{svg.mdiEmail}}
        | {{tutor.email}}
      div
        v-icon(left, small) {{svg.mdiCardText}}
        | année
        | département
      div
        v-icon(left, small) {{svg.mdiStar}}
        | matières préférées
    v-card-actions
</template>

<script>
import { mdiAccount, mdiStar, mdiCardText, mdiEmail } from '@mdi/js'

export default {
  props: {
    tutor: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      svg: {
        mdiAccount,
        mdiStar,
        mdiCardText,
        mdiEmail
      }
    }
  }
}
</script>
