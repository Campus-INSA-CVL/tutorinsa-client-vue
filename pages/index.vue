<template lang="pug">
  div
    v-row(justify="end")
      v-col(cols="12", md="6")
        h1 bienvenue sur tutorinsa
      v-col(cols="6")
        signup-app(v-if="!isAuth && $vuetify.breakpoint.mdAndUp")
    v-row
      v-col(cols="12")
        FeathersVuexFind(service="posts", :query="{}")
          section(slot-scope="{ items: posts }") {{posts}}
</template>

<script>
import { mapGetters } from 'vuex'
import { FeathersVuexFind } from 'feathers-vuex'
import Signup from '@/components/Signup'

export default {
  components: {
    FeathersVuexFind,
    'signup-app': Signup
  },
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated'
    })
  }
}
</script>
