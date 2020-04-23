<template lang="pug">
  iterator-table-app(:numberOfItems="numberOfPosts", service="posts", modelName="posts")
    template(v-slot:card="{ item }")
      preview-post-app(:post="item", outlined)
</template>

<script>
import { mapActions } from 'vuex'

import IteratorDataTable from '@/components/Admin/IteratorDataTable'

import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'AdminPosts',
  components: {
    'iterator-table-app': IteratorDataTable,
    'preview-post-app': PreviewPost
  },
  data() {
    return {
      numberOfPosts: null
    }
  },
  async mounted() {
    try {
      const response = await this.Posts({ query: { $limit: 0 } })
      this.numberOfPosts = response.total
    } catch (error) {
      throw new Error(error.message)
    }
  },
  methods: {
    ...mapActions({
      Posts: 'posts/find'
    })
  }
}
</script>
