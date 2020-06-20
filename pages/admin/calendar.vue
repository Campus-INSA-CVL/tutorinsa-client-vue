<template lang="pug">
  iterator-table-app(:numberOfItems="numberOfCalendars", service="calendars", modelName="Calendar", :itemsPerPageArray="[12, 24, 36]")
    template(v-slot:title="{ item }") {{item.room.day}}-{{ $moment(item.startAt).format('LT') }}

    template(v-slot:subtitle="{ item }")

    template(v-slot:text="{ item }")
      ul
        li(v-for="(slot, index) in item.slots", :key="index") {{slot.post.comment}} {{$moment(slot.startAt).format('LLLL')}} {{$moment(slot.startAt).format('LLLL')}}
      div mise à jour le {{ $moment(item.updatedAt).format('LL [à] LT') }} ({{ $moment(item.updatedAt).fromNow() }})
      div créé le {{ $moment(item.createdAt).format('LL [à] LT') }} ({{ $moment(item.createdAt).fromNow() }})
</template>

<script>
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
  }
}
</script>
