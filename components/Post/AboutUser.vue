<template lang="pug">
  v-card(outlined)
    v-card-title
      v-icon(left) {{svg.mdiAccount}}
      | #[span.text-uppercase {{user.lastName}}]&nbsp;#[span.text-capitalize {{user.firstName}}]
    v-card-text
      div
        v-icon(left, small) {{svg.mdiEmail}}
        | {{user.email}}
      div
        v-icon(left, small) {{svg.mdiCardText}}
        //- span {{user.year.name.toUpperCase()}}-{{user.department.name.toUpperCase()}}
      div
        v-icon(left, small) {{svg.mdiStar}}
        span matières préférées
        ul
          li(v-for="(subject, index) in user.favoriteSubjects", :key="index") {{subject.name}}
</template>

<script>
import { mdiAccount, mdiStar, mdiCardText, mdiEmail } from '@mdi/js'

export default {
  name: 'AboutUser',
  props: {
    user: {
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
