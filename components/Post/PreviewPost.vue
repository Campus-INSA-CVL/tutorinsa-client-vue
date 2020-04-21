<template lang="pug">
  v-hover(v-slot:default="{ hover }")
    v-card(:class="isEleve(post.type) ? 'student': 'tutor'", :elevation="hover ? 12 : 4" )

      v-card-title
        span.text-uppercase.font-weight-bold {{post.subject.name}}
        span.subtitle-2 &nbsp;({{$moment(post.date).fromNow()}})

      v-card-subtitle
        v-icon(small, left) {{svg.mdiCalendar}}
        span.text-capitalize &nbsp;{{$moment(post.date).local().format('dddd LL')}}
        br
        v-icon(small, left) {{svg.mdiClockOutline}}
        span {{$moment(post.date).local().format('LT')}}-{{$moment(post.endAt).local().format('LT')}}&nbsp;({{$moment(post.duration).utc().format('HH[:]mm')}})
        br
        v-icon(small, left, v-if="post.creator") {{svg.mdiSchool}}
        span(v-if="post.creator")  {{post.creator.lastName.toUpperCase()}} #[span.text-capitalize {{post.creator.firstName}}]

      v-card-text.text-justify.body-1.text-truncate {{post.comment}}

      v-card-actions
        v-spacer
        v-btn(depressed, outlined, @click="share(post)", v-if="shareBtn") partager
        v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'", nuxt, :to="`/post/${post._id}`") voir plus
</template>

<script>
import { mdiClockOutline, mdiCalendar, mdiSchool } from '@mdi/js'

export default {
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    },
    shareBtn: {
      type: Boolean,
      default: false
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
