<template lang="pug">
  v-row(no-guetters)
    v-col(cols="12")
      title-app #[span.text-capitalize besoin] d'aide sur #[tutorinsa-app]&nbsp;?
</template>

<script>
import TutorInsa from '@/components/Misc/TutorInsa'
import Title from '@/components/Misc/Title'

export default {
  name: 'Help',
  components: {
    'tutorinsa-app': TutorInsa,
    'title-app': Title
  },
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  head() {
    return {
      title: 'Aide'
    }
  }
}
</script>
