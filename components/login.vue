<template lang="pug">
  v-card
    form(autocomplete="on", @submit.prevent="submit()")
      v-card-title
        span login
      v-card-text
        v-text-field(type="email", placeholder="email", v-model="email")
        v-text-field(type="password", placeholder="password", v-model="password")
      v-card-actions
        v-spacer
        v-btn(type="submit")
          v-icon(left) mdi-login-variant
          span login
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    submit() {
      console.log(this.email, this.password)
    }
  }
}
</script>
