<template lang="pug">
  p(:class="className").mx-6.mt-4.subtitle
    slot
</template>

<script>
export default {
  name: 'TextApp',
  props: {
    justify: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      if (this.justify && this.center) {
        throw new Error("Can't use justify and center at the same time")
      }
      let str = ''
      str += this.justify ? 'text-justify' : ''
      str += this.center ? 'text-center' : ''

      return str
    }
  }
}
</script>
