<template lang="pug">
  v-snackbar(v-model="active", :color="color") {{message}}
    template(v-slot:action="{ attrs }")
      v-btn(v-bind="attrs", v-if="close", @click="closeSnack", icon)
        v-icon {{svg.mdiClose}}

</template>

<script>
import { mdiClose } from '@mdi/js'

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'GlobalSnack',
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    message: {
      type: String,
      default: 'No message',
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    close: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  data() {
    return {
      svg: {
        mdiClose
      }
    }
  },
  methods: {
    closeSnack() {
      EventBus.$emit('closeSnack')
    }
  }
}
</script>
