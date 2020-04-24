<template lang="pug">
  v-row
    v-col(align="center")
      v-btn(href="https://celene.insa-cvl.fr/my/", target="_blank", depressed).primary
        v-icon(left) {{svg.mdiSchool}}
        span celene
</template>

<script>
import { mdiSchool } from '@mdi/js'

export default {
  name: 'HelpResources',
  data() {
    return {
      svg: {
        mdiSchool
      }
    }
  }
}
</script>
