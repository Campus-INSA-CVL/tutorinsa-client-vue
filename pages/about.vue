<template lang="pug">
  v-row(no-gutters, justify="center")
    v-col(cols="12", align="center")
       v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/icon.png')", width="200").mt-2.mb-4
    v-col(cols="12")
      title-app(:textCenter="true")
        template(slot="default") #[span.text-capitalize à] propos de #[tutorinsa-app]
    v-col(cols="12", sm="10", md="8", xl="6", align="center")
      welcome-app
    v-col(cols="12")
      title-app(:textCenter="true").mt-4
        template(slot="default") #[span.text-capitalize à] propos du site
    v-col(cols="12", sm="10", md="8", xl="6", align="center")
      site-app


</template>

<script>
import TutorInsa from '@/components/TutorInsa'
import Title from '@/components/Title'
import Welcome from '@/components/Welcome'
import Site from '@/components/Site'

export default {
  components: {
    'tutorinsa-app': TutorInsa,
    'title-app': Title,
    'welcome-app': Welcome,
    'site-app': Site
  },
  head() {
    return {
      title: 'À propos'
    }
  }
}
</script>
