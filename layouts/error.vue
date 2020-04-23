<template lang="pug">
  section
    v-row
      v-col(align="center")
        div(v-if="error.statusCode === 404", :data-text="pageNotFound").glitch {{pageNotFound}}
        h1(v-else) {{otherError}}
    nuxt-link(to="/") Home page
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
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
