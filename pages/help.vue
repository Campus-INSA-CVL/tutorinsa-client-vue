<template lang="pug">
  v-row(no-guetters)
    v-col(cols="12")
      title-app #[span.text-capitalize besoin] d'aide sur #[tutorinsa-app]&nbsp;?
</template>

<script>
import TutorInsa from '@/components/TutorInsa'
import Title from '@/components/Title'

export default {
  components: {
    'tutorinsa-app': TutorInsa,
    'title-app': Title
  },
  head() {
    return {
      title: 'Aide'
    }
  }
}
</script>
