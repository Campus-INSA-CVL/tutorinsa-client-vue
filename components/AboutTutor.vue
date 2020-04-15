<template lang="pug">
component(:is="transition !== 'None' ? `v-${transition}` : 'div'", hide-on-leave, v-if="tutor")
  v-skeleton-loader(type="card", v-if="loading")
  v-card(outlined, v-else)
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
      },
      transition: 'scale-transition'
    }
  },
  computed: {
    loading() {
      return this.tutor === null
    }
  }
}
</script>
