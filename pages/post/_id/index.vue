<template lang="pug">
  v-row
    v-col(cols="12", md="8")
      post-app(:post="post")
    v-col(cols="12", sm="6", md="4", v-if="post && post.creator")
      h3(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-capitalize.font-weight-regular créateur
      about-user-app(:user="post.creator")
      h3(v-if="!isEleve(post.type)").text-capitalize.font-weight-regular.mt-4 tuteurs
      about-user-app(v-for="(tutor, index) in othersTutors", :user="tutor", :key="index")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import Post from '@/components/Post/Post'
import AboutUser from '@/components/Post/AboutUser'

export default {
  name: 'PostId',
  components: {
    'post-app': Post,
    'about-user-app': AboutUser
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
    },
    othersTutors() {
      const creatorId = this.post?.creatorId?.toString()
      return this.post?.tutors?.filter(
        (tutor) => tutor._id.toString() !== creatorId
      )
    }
  },
  methods: {
    ...mapActions({
      fetchPost: 'posts/get'
    }),
    isEleve(type) {
      return type === 'eleve'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
