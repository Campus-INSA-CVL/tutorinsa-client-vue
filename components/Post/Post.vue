<template lang="pug">
  v-card(outlined)
    v-card-title #[span.text-uppercase.font-weight-bold {{post.subject.name}}] #[span.subtitle-2 &nbsp;({{$moment(post.date).fromNow()}})]
    v-card-text.body-1
      div #[v-icon(left) {{svg.mdiCalendar}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold quand ?] #[span.text-capitalize &nbsp;{{$moment(post.date).local().format('dddd LL')}}]

      div #[v-icon(left) {{svg.mdiClockOutline}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold où ?] #[span &nbsp;{{$moment(post.date).local().format('LT')}}-{{$moment(post.endAt).local().format('LT')}}&nbsp;](durée: {{$moment(post.duration).utc().format('HH[\']mm["]')}}) #[span(v-if="post.room") en {{post.room.name}} à {{post.room.campus.toUpperCase()}}]

      div(v-if="post.creator") #[v-icon(left) {{svg.mdiSchool}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold par qui ?] {{post.creator.lastName.toUpperCase()}} #[span.text-capitalize {{post.creator.firstName}}]

      div(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").title.mt-4 #[span.text-capitalize le]&nbsp;message du tuteur:
      div.text-justify {{post.comment}}
    v-card-actions
      v-spacer
      v-btn(outlined, @click="share(post)") partager
      v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'") s'inscrire
</template>

<script>
import { mdiClockOutline, mdiCalendar, mdiSchool } from '@mdi/js'

export default {
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
          text: `${this.$moment(post.date)
            .local()
            .format('[Le] dddd LL [à] LT')}\n\nLe mot du tuteur: ${
            post.comment
          }\n`,
          title: `TutorINSA: ${post.subject.name.toUpperCase()}`
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
