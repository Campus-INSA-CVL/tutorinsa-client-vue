<template lang="pug">
  div
    v-row(align="start" v-if="!isAuth")
      v-col(cols="12", md="6", align="center")
        v-img(alt="logo de l'association TutorINSA", :src="require(`~/assets/img/logo_${$vuetify.theme.dark ? 'white' : 'black'}.png`)", width="200").mb-4#main-logo
        title-app(center) #[span.text-capitalize bienvenue] sur #[tutorinsa-app]
        welcome-app
      v-col(cols="6", v-if="$vuetify.breakpoint.mdAndUp")
        signup-app
    v-row
      v-col(cols="12").pt-0
        FeathersVuexFind(service="posts", :query="{$sort: {date: 1}}")
          h1.title.
            #[span.text-capitalize ensemble] des annonces
          section(slot-scope="{ items: posts , isFindPending }")
            v-row(justify="space-around")
              v-col(cols="12", sm="6", lg="4",v-for="(post, index) in posts", :key="index", align-self="center")
                component(:is="transition !== 'None' ? `v-${transition}` : 'div'"
          hide-on-leave)
                  v-skeleton-loader(type="article, actions", v-if="isFindPending")
                  preview-post-app(:post="post", shareBtn, hoverProp, v-else)
</template>

<script>
import { mapGetters } from 'vuex'
import { FeathersVuexFind } from 'feathers-vuex'
import Title from '@/components/Misc/Title'
import Tutorinsa from '@/components/Misc/TutorInsa'
import Signup from '@/components/Auth/Signup'
import PreviewPost from '@/components/Post/PreviewPost'
import Welcome from '@/components/Misc/Welcome'

export default {
  name: 'Index',
  components: {
    FeathersVuexFind,
    'title-app': Title,
    'tutorinsa-app': Tutorinsa,
    'signup-app': Signup,
    'preview-post-app': PreviewPost,
    'welcome-app': Welcome
  },
  data() {
    return {
      transition: 'fade-transition'
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated'
    })
  },
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  head() {
    return {
      title: 'Acceuil'
    }
  }
}
</script>
