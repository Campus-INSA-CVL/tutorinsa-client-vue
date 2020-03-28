<template lang="pug">
  v-app
    v-content
      v-container(fluid)
        v-row(align="start", justify="center")
          v-col(cols="12", align="center")
            nuxt-link(to="/")
              v-img(alt="logo de l'association TutorINSA", :src="require('~/assets/img/icon.png')", width="200")
        nuxt
</template>

<script>
export default {}
</script>
