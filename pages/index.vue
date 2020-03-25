<template lang="pug">
  div
    h1 welcome boy !
    p() {{user}} {{$can('create', 'years')}}
    p(v-if="$can('create', 'years')") ça marche pas !!!!
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAuth: 'auth/isAuthenticated',
      user: 'auth/user'
    })
  }
}
</script>
