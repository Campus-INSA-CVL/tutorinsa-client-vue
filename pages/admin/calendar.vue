<template lang="pug">
  iterator-table-app(:numberOfItems="numberOfCalendars", service="calendar", modelName="Calendar")
    template(v-slot:title="{ item }") {{ $moment(item.date).format('dddd LL [à] LT') }}

    template(v-slot:subtitle="{ item }")

    template(v-slot:text="{ item }")
      ul
        li(v-for="(slot, index) in item.slots", :key="index") {{slot.postId}} {{$moment(slot.startAt).format('LLLL')}} {{$moment(slot.startAt).format('LLLL')}}
      div mise à jour le {{ $moment(item.updatedAt).format('LL [à] LT') }} ({{ $moment(item.updatedAt).fromNow() }})
      div créé le {{ $moment(item.createdAt).format('LL [à] LT') }} ({{ $moment(item.createdAt).fromNow() }})
</template>

<script>
import { mapActions } from 'vuex'

import IteratorDataTable from '@/components/Admin/IteratorDataTable'

export default {
  name: 'AdminCalendar',
  components: {
    'iterator-table-app': IteratorDataTable
  },
  data() {
    return {
      numberOfCalendars: null
    }
  },
  async mounted() {
    try {
      const response = await this.Calendar({ query: { $limit: 0 } })
      this.numberOfCalendars = response.total
    } catch (error) {
      throw new Error(error.message)
    }
  },
  methods: {
    ...mapActions({
      Calendar: 'calendar/find'
    })
  }
}
</script>
