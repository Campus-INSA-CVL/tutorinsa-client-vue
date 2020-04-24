<template lang="pug">
  v-row
    v-col(cols="12", md="7")
      post-app(:post="post")
    v-col(cols="6", md="5", v-if="post && post.creator")
      about-creator-app(:creator="post.creator")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// import { EventBus } from '@/utils/event-bus'

import Post from '@/components/Post/Post'
import AboutCreator from '@/components/Post/AboutCreator'

export default {
  name: 'PostId',
  components: {
    'post-app': Post,
    'about-creator-app': AboutCreator
  },
  // async fetch() {
  //   try {
  //     let response = await this.getPost(this.$route.params.id)
  //     if (response === null) {
  //       response = await this.fetchPost(this.$route.params.id)
  //     }
  //     this.post = response
  //   } catch (error) {
  //     EventBus.$emit('snackEvent', {
  //       color: 'error',
  //       message: 'Une erreur est survenue lors du chargement des postes',
  //       active: true,
  //       close: true
  //     })
  //   }
  // },
  asyncData(context) {
    console.debug('context:', context)
    const { store, params, error } = context
    const post = store.getters['posts/get'](params.id)
    if (!post) {
      return store
        .dispatch('posts/get', params.id)
        .then((res) => {
          console.debug('res:', res)
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
  // fetchOnServer: false,
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
