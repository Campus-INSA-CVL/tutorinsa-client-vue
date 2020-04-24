<template lang="pug">
  v-row
    v-col(cols="12", md="7")
      post-app(:post="post")
    v-col(cols="12", md="6", v-if="post && post.creator")
      about-creator-app(:creator="post.creator")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Post from '@/components/Post/Post'
import AboutCreator from '@/components/Post/AboutCreator'

export default {
  name: 'PostId',
  components: {
    'post-app': Post,
    'about-creator-app': AboutCreator
  },
  asyncData(context) {
    const { store, params, error } = context
    const post = store.getters['posts/get'](params.id)
    if (!post) {
      return store
        .dispatch('posts/get', params.id)
        .then((res) => {
          return { post: res }
        })
        .catch((e) => {
          error({
            statusCode: e.code,
            message: e.message,
            name: e.name,
            errors: e.errors
          })
        })
    } else {
      return { post }
    }
  },
  data() {
    return {
      transition: 'fade-transition'
    }
  },
  computed: {
    ...mapGetters({
      getPost: 'posts/get'
    }),
    title() {
      return this.post ? this.post.subject.name.toUpperCase() : 'Chargement...'
    },
    loading() {
      return !this.post
    }
  },
  methods: {
    ...mapActions({
      fetchPost: 'posts/get'
    })
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
