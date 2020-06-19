<template lang="pug">
  v-card(outlined)
    v-card-title #[span.text-uppercase.font-weight-bold {{post.subject.name}}] #[span(v-if="post.startAt").subtitle-2 &nbsp;({{$moment(post.startAt).fromNow()}})]
    v-card-text.body-1
      div(v-if="post.startAt") #[v-icon(left) {{svg.mdiCalendar}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold quand ?] #[span.text-capitalize &nbsp;{{$moment(post.startAt).local().format('dddd LL')}}]

      div(v-if="post.startAt") #[v-icon(left) {{svg.mdiClockOutline}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold où ?] #[span &nbsp;{{$moment(post.startAt).local().format('LT')}}-{{$moment(post.endAt).local().format('LT')}}&nbsp;](durée: {{$moment.utc(0).add($moment.duration(post.duration, 'minutes')).format('HH[\']mm["]')}}) #[span(v-if="post.room") en {{post.room.name.toUpperCase()}} à {{post.room.campus.toUpperCase()}}]

      div(v-if="post.creator") #[v-icon(left) {{svg.mdiSchool}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold par qui ?] {{post.creator.lastName.toUpperCase()}} #[span.text-capitalize {{post.creator.firstName}}]

      div(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").title.mt-4 #[span.text-capitalize le]&nbsp;message du créateur:
      div.text-justify.mb-4 {{post.comment}}
      v-divider
      v-row(v-if="!isEleve(post.type)")
        v-col(cols="12", sm="6").pb-0
          div Nombre de tuteurs
            v-progress-linear(color="primary", :value="post.tutorsIds.length * 100 / post.tutorsCapacity", height="16", rounded)
              template(v-slot="{ value }")
                span.text-body-2.white--text {{post.tutorsIds.length}}/{{post.tutorsCapacity}}
        v-col(cols="12", sm="6")
          div Nombre d'étudiants
            v-progress-linear(color="eleve", :value="post.studentsIds.length * 100 / post.studentsCapacity", height="16", rounded)
              template(v-slot="{ value }")
                span.text-body-2 {{post.studentsIds.length}}/{{post.studentsCapacity}}
    v-card-actions
      v-spacer
      v-btn(outlined, @click="share(post)") partager
      //- v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'") s'inscrire
</template>

<script>
import { mdiClockOutline, mdiCalendar, mdiSchool } from '@mdi/js'

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      svg: {
        mdiClockOutline,
        mdiCalendar,
        mdiSchool
      }
    }
  },
  methods: {
    isEleve(type) {
      return type === 'eleve'
    },
    async share(post) {
      try {
        await navigator.share({
          url: `post/${post._id}`,
          text: `${this.$moment(post.startAt)
            .local()
            .format('[Le] dddd LL [à] LT')}\n\nLe mot du tuteur: ${
            post.comment
          }\n`,
          title: `TutorINSA: ${post.subject.name.toUpperCase()}`
        })
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
        EventBus.$emit('snackEvent', {
          color: 'error',
          message:
            'Une erreur est survenue lors du chargement de la fonction partager',
          active: true,
          close: true
        })
      }
    }
  }
}
</script>
