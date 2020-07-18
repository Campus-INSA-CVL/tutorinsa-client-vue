<template lang="pug">
  v-row(no-guetters, , justify="center")
    v-col(cols="12", align="center")
       v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/icon.png')", width="200").mt-2.mb-4
    v-col(cols="12")
      title-app(textCenter) #[span.text-capitalize besoin] d'aide sur #[tutorinsa-app]&nbsp;?
    v-col(cols="12")
      v-toolbar(short, flat)
        v-tabs(grow, show-arrows)
          v-tabs-slider(color="primary")
          v-tab(v-for="(item, index) in tabs", :key="index", :to="item.link", nuxt, exact) {{item.name}}
    v-col(cols="12")
      v-container(fluid)
        nuxt-child
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
  data() {
    return {
      tabs: [
        { name: 'fonctionnement', link: '/help/how-it-works' },
        { name: 'ressources', link: '/help/resources' },
        { name: 'nous contacter', link: '/help/contact' }
      ]
    }
  },
  head() {
    return {
      title: 'Aide'
    }
  }
}
</script>
