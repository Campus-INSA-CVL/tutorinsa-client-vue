<template lang="pug">
  v-card(outlined, v-if="post")
    v-card-title.text-uppercase {{post.subject.name}}
    v-card-text.body-1 {{post.comment}}
    v-card-actions
    p {{post}}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  async fetch() {
    try {
      let response = await this.getPost(this.$route.params.id)
      if (response === null) {
        response = await this.fetchPost(this.$route.params.id)
      }
      this.post = response
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  },
  fetchOnServer: false,
  data() {
    return {
      post: undefined
    }
  },
  computed: {
    ...mapGetters({
      getPost: 'posts/get'
    })
  },
  methods: {
    ...mapActions({
      fetchPost: 'posts/get'
    })
  }
}
</script>
