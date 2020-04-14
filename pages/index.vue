<template lang="pug">
  div
    v-row(align="start" v-if="!isAuth")
      v-col(cols="12", md="6", align="center")
        v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/logo_white.png')", width="200").mb-4
        title-app(center) #[span.text-capitalize bienvenue] sur #[tutorinsa-app]
        welcome-app
      v-col(cols="6", v-if="$vuetify.breakpoint.mdAndUp")
        signup-app
    v-row
      v-col(cols="12").pt-0
        FeathersVuexFind(service="posts", :query="{$sort: {date: 1}}")
          h1.title.
            #[span.text-capitalize ensemble] des annonces
          section(slot-scope="{ items: posts }")
            v-row(justify="space-around")
              v-col(cols="12", md="6", lg="3",v-for="(post, index) in posts", :key="index")
                post-app(:post="post")
</template>

<script>
import { mapGetters } from 'vuex'
import { FeathersVuexFind } from 'feathers-vuex'
import Title from '@/components/Title'
import Tutorinsa from '@/components/TutorInsa'
import Signup from '@/components/Signup'
import Post from '@/components/Post'
import Welcome from '@/components/Welcome'

export default {
  components: {
    FeathersVuexFind,
    'title-app': Title,
    'tutorinsa-app': Tutorinsa,
    'signup-app': Signup,
    'post-app': Post,
    'welcome-app': Welcome
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated'
    })
  },
  head() {
    return {
      title: 'Acceuil'
    }
  }
}
</script>
