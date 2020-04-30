<template lang="pug">
  v-row(justify="start")
    v-col(cols="12", sm="8", md="6", lg="4")
      user-app(:user="user")
    v-col(cols="12", sm="4", md="6", lg="8", v-if="user").pt-0
      v-row()
        v-col(v-for="(post, index) in user.createdPosts",:key="index", cols="12", md="6")
          preview-post-app(:post="post", hoverProp, deletable)
</template>

<script>
import { mapGetters } from 'vuex'

import User from '@/components/User/User'
import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'Profile',
  components: {
    'user-app': User,
    'preview-post-app': PreviewPost
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  head() {
    return {
      title: 'Profile'
    }
  }
}
</script>

<style></style>
