<template lang="pug">
  v-row(justify="center")
    v-col(cols="12", md="6", lg="4")
      user-app
</template>

<script>
import User from '@/components/User'

export default {
  components: {
    'user-app': User
  }
}
</script>
