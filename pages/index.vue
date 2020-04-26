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
        iterator-table-app(service="posts", modelName="posts", :itemsPerPageArray="[12,24,36]")
          template(v-slot:card="{ item }")
            preview-post-app(:post="item", shareBtn, hoverProp)
</template>

<script>
import { mapGetters } from 'vuex'

import Tutorinsa from '@/components/Misc/TutorInsa'
import Title from '@/components/Misc/Title'
import Welcome from '@/components/Misc/Welcome'
import Signup from '@/components/Auth/Signup'

import IteratorDataTable from '@/components/Admin/IteratorDataTable'
import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'Index',
  components: {
    'iterator-table-app': IteratorDataTable,
    'title-app': Title,
    'tutorinsa-app': Tutorinsa,
    'signup-app': Signup,
    'preview-post-app': PreviewPost,
    'welcome-app': Welcome
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
