<template lang="pug">
  div
    v-row(justify="end")
      v-col(cols="12", md="6")
        h1 bienvenue sur tutorinsa
      v-col(cols="6")
        signup-app(v-if="!isAuth && $vuetify.breakpoint.mdAndUp")
    v-row
      v-col(cols="12")
        FeathersVuexFind(service="posts", :query="{$sort: {date: 1}}")
          section(slot-scope="{ items: posts }")
            v-row
              v-col(cols="12", md="6", lg="3",v-for="(post, index) in posts", :key="index")
                v-hover(v-slot:default="{ hover }")
                  v-card(:class="isEleve(post.type) ? 'student': 'tutor'", :elevation="hover ? 12 : 4" )

                    v-card-title.
                      #[span.text-capitalize.font-weight-bold {{post.subject.name}}]

                    v-card-subtitle
                      span.text-capitalize date:&nbsp;
                      span.text-capitalize {{$moment(post.date).local().format('dddd LL [à] LT')}}
                      span &nbsp;({{$moment(post.date).fromNow()}})
                      br
                      span.text-capitalize durée:&nbsp;
                      span {{$moment(post.duration).utc().format('H [heures]  m')}}

                    v-card-text.text-justify {{post.comment}}

                    v-card-actions
                      v-spacer
                      v-btn(depressed, outlined) partager
                      v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'") voir plus

              p {{posts}}
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
  },
  methods: {
    isEleve(type) {
      return type === 'eleve'
    }
  }
}
</script>

<style>
.tutor {
  border-left: 5px solid;
  border-left-color: var(--v-primary-base) !important;
}
.student {
  border-left: 5px solid;
  border-left-color: var(--v-eleve-base) !important;
}
</style>
