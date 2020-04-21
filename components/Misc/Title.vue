<template lang="pug">
  div(:class="textCenter ? 'text-center': ''").display-1
    slot
</template>

<script>
export default {
  name: 'Title',
  props: {
    textCenter: {
      type: Boolean,
      default: false
    }
  }
}
</script>
