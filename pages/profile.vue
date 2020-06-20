<template lang="pug">
  v-row(justify="start")
    v-col(cols="12", sm="8", md="6", lg="4").pt-0
      user-app(:user="user")
    v-col(cols="12", sm="4", md="6", lg="8", v-if="user").pt-0
      iterator-table-app(:numberOfItems="numberOfPosts", service="posts", modelName="posts", :itemsPerPageArray="[12, 24, 36]", :query="{ _id: { $in: this.user.createdPostsIds } }", large)
        template(v-slot:card="{ item }")
          preview-post-app(:post="item", outlined, deletable)
</template>

<script>
import { mapGetters } from 'vuex'

import User from '@/components/User/User'
import IteratorDataTable from '@/components/Admin/IteratorDataTable'
import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'Profile',
  components: {
    'user-app': User,
    'iterator-table-app': IteratorDataTable,
    'preview-post-app': PreviewPost
  },
  data() {
    return {
      numberOfPosts: null
    }
  },
  fetchOnServer: false,
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
