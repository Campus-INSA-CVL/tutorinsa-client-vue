<template lang="pug">
  //- component(:is="transition !== 'None' ? `v-${transition}` : 'div'", hide-on-leave, v-if="tutor")
  //-   v-skeleton-loader(type="card", v-if="loading")
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
