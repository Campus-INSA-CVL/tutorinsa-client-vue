<template lang="pug">
  v-row(justify="center")
    v-col(cols="12", xs="12", sm="12", md="9", lg="5", align="center").mt-6
      signup-app
</template>

<script>
import Signup from '@/components/Auth/Signup'

export default {
  name: 'Signup',
  components: {
    'signup-app': Signup
  },
  layout: 'empty'
}
</script>
