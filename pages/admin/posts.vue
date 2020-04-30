<template lang="pug">
  iterator-table-app(:numberOfItems="numberOfPosts", service="posts", modelName="posts", :itemsPerPageArray="[12, 24, 36]")
    template(v-slot:card="{ item }")
      preview-post-app(:post="item", outlined, deletable)
</template>

<script>
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
  }
}
</script>
