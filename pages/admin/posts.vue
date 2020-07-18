<template lang="pug">
iterator-table-app(serviceName="posts", :itemsPerPageArray="[12,24,36]")
  template(v-slot:card="{ item }")
    preview-post-app(:post="item", outlined, deletable)
</template>

<script>
import IteratorDataTable from '@/components/Tables/IteratorDataTable'
import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'AdminPosts',
  components: {
    'iterator-table-app': IteratorDataTable,
    'preview-post-app': PreviewPost
  }
}
</script>
