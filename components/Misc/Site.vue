<template lang="pug">
  div
    text-app(justify) Ce site a été conçu par des élèves-ingénieurs de l'INSA Centre-Val de Loire. Pour tous problèmes ou retours, n'hésitez pas à nous contacter!
    v-row(align="center", justify="space-around")
      v-col(align="center")
        v-btn(outlined, href="http://www.insa-centrevaldeloire.fr") insa cvl
      v-col(align="center")
        v-btn(outlined, color="primary") contact
</template>

<script>
import Text from '@/components/Misc/Text'

export default {
  components: {
    'text-app': Text
  }
}
</script>
