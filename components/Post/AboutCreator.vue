<template lang="pug">
  v-card(outlined)
    v-card-title #[span.text-capitalize à]&nbsp;propos du tuteur
    v-card-text
      div
        v-icon(left, small) {{svg.mdiAccount}}
        | #[span.text-uppercase {{creator.lastName}}] #[span.text-capitalize {{creator.firstName}}]
      div
        v-icon(left, small) {{svg.mdiEmail}}
        | {{creator.email}}
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
  name: 'AboutCreator',
  props: {
    creator: {
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
      },
      transition: 'fade-transition'
    }
  },
  computed: {
    loading() {
      return this.tutor === null
    }
  }
}
</script>
