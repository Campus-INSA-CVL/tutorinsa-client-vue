<template lang="pug">
  v-row
    v-col(cols="12", md="7")
      component(:is="transition !== 'None' ? `v-${transition}` : 'div'", hide-on-leave)
        v-skeleton-loader(type="article, list-item-three-line, actions", v-if="loading")
        post-app(:post="post", v-else)
    v-col(cols="6", md="5", v-if="post && post.creator")
      component(:is="transition !== 'None' ? `v-${transition}` : 'div'", hide-on-leave)
        v-skeleton-loader(type="article", v-if="loading")
        about-creator-app(:creator="post.creator", v-else)
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { EventBus } from '@/utils/event-bus'

import Post from '@/components/Post/Post'
import AboutCreator from '@/components/Post/AboutCreator'

export default {
  name: 'PostId',
  components: {
    'post-app': Post,
    'about-creator-app': AboutCreator
  },
  async fetch() {
    try {
      let response = await this.getPost(this.$route.params.id)
      if (response === null) {
        response = await this.fetchPost(this.$route.params.id)
      }
      this.post = response
    } catch (error) {
      EventBus.$emit('snackEvent', {
        color: 'error',
        message: 'Une erreur est survenue lors du chargement des postes',
        active: true,
        close: true
      })
    }
  },
  fetchOnServer: false,
  data() {
    return {
      transition: 'fade-transition',
      post: null
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
      return this.post === null
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
