<template lang="pug">
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

      v-card-text.text-justify.
        #[span {{post.comment}}] #[span(v-if="post.creator") par {{post.creator.firstName}}]

      v-card-actions
        v-spacer
        v-btn(depressed, outlined, @click="share(post)") partager
        v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'", nuxt, :to="`/post/${post._id}`") voir plus
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    isEleve(type) {
      return type === 'eleve'
    },
    async share(post) {
      try {
        await navigator.share({
          url: `post/${post._id}`,
          text: post.comment,
          title: post.subject.name
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
