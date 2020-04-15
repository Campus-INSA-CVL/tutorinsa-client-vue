<template lang="pug">
  v-row
    v-col(cols="12", md="7")
      post-app(:postId="$route.params.id" @postTitle="setTitle" @postTutor="setTutor")
    v-col(cols="6", md="5")
      about-tutor-app(:tutor="tutor")
</template>

<script>
import Post from '@/components/Post'
import AboutTutor from '@/components/AboutTutor'

export default {
  components: {
    'post-app': Post,
    'about-tutor-app': AboutTutor
  },
  data() {
    return {
      title: null,
      tutor: null
    }
  },
  methods: {
    setTitle(event) {
      this.title = event
    },
    setTutor(event) {
      this.tutor = event
    }
  },
  head() {
    return {
      title: this.title ? this.title.toUpperCase() : 'Chargement...'
    }
  }
}
</script>
