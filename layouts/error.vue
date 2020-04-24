<template lang="pug">
  section
    v-row(justify="space-around")
      v-col(cols="12", align="center")
        div(v-if="error.statusCode === 404", :data-text="pageNotFound").glitch {{pageNotFound}}
        div(v-else-if="error.statusCode === 500", :data-text="internalServerError").glitch {{internalServerError}}
        div(v-else, :data-text="`${error.statusCode}, ${otherError}`").glitch {{error.statusCode}},&nbsp;{{otherError}}

      v-col(cols="6", align="center")
        v-btn(@click="more", depressed)
          v-icon(left) {{svg.mdiLightbulbOn}}
          span en savoir plus
      v-col(cols="6", align="center")
        v-btn(:href="`mailto:${email}?subject=TutorINSA: Error ${this.error.statusCode}&body=Name: ${this.error.name}%0D%0ACode: ${this.error.statusCode}%0D%0AMessage: ${this.error.message}%0D%0A`", depressed)
          v-icon(left) {{svg.mdiEmail}}
          span envoyer un rapport d'erreur
</template>

<script>
import { mdiLightbulbOn, mdiEmail } from '@mdi/js'

export default {
  name: 'ErrorLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      svg: {
        mdiLightbulbOn,
        mdiEmail
      },
      pageNotFound: '404 Not Found',
      internalServerError: '500 Internal Server Error',
      otherError: "c'est une erreur !"
    }
  },
  computed: {
    message() {
      console.dir(this.error)
      return `Name: ${this.error.name}\nCode: ${this.error.statusCode}\nMessage: ${this.error.message}`
    },
    email() {
      return process.env.EMAIL
    }
  },
  methods: {
    more() {
      alert(this.message)
    }
  },
  head() {
    let title = ''
    switch (this.error.statusCode) {
      case 404:
        title = this.pageNotFound
        break
      case 500:
        title = this.internalServerError
        break
      default:
        title = `${this.error.statusCode}, ${this.otherError}`
        break
    }
    return {
      title
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300&display=swap');

.glitch {
  font-size: 6rem;
  line-height: 6rem;
  font-family: Nunito, sans-serif;
  position: relative;
}
@keyframes noise-anim {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      clip-path: inset(#{$top} + '%' 0 #{$bottom} + '%' 0);
    }
  }
}
.glitch::after {
  content: attr(data-text);
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 2px;
  right: 0;
  text-align: center;
  text-shadow: -1px 0 red;
  top: 0;
  background: transparent;
  overflow: hidden;
  animation: noise-anim 1.2s infinite linear alternate-reverse;
}
@keyframes noise-anim-2 {
  $steps: 20;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      clip-path: inset(#{$top} + '%' 0 #{$bottom} + '%' 0);
    }
  }
}
.glitch::before {
  content: attr(data-text);
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: -2px;
  right: 0;
  text-align: center;
  text-shadow: 2px 0 rgb(0, 68, 255);
  top: 0;
  background: transparent;
  overflow: hidden;
  animation: noise-anim-2 12s infinite linear alternate-reverse;
}
</style>
