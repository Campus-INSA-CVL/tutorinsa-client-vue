<template lang="pug">
  iterator-table-app(:numberOfItems="numberOfRooms", service="rooms", modelName="Room", deletable, :itemsPerPageArray="[12, 24, 36]")
    template(v-slot:title="{ item }") #[span.text-uppercase.primary--text {{item.name}}]&nbsp;-&nbsp;#[span.text-capitalize {{item.day}}]


    template(v-slot:text="{ item }")
      div #[v-icon {{svg.mdiMapMarker}}]&nbsp;#[span.text-uppercase {{item.campus}}]
      div #[v-icon {{svg.mdiClockOutline}}]&nbsp;#[span.text-uppercase {{$moment(item.time).format('LT')}}]
      div #[v-icon {{svg.mdiClockStart }}]&nbsp;#[span.text-uppercase {{$moment.utc(item.duration).format('LT')}}]
      br
      div.body-2 mise à jour le {{ $moment(item.updatedAt).format('LL [à] LT') }} ({{ $moment(item.updatedAt).fromNow() }})
      div.body-2 créé le {{ $moment(item.createdAt).format('LL [à] LT') }} ({{ $moment(item.createdAt).fromNow() }})
</template>

<script>
import { mdiMapMarker, mdiClockOutline, mdiClockStart } from '@mdi/js'

import IteratorDataTable from '@/components/Admin/IteratorDataTable'

export default {
  name: 'AdminRooms',
  components: {
    'iterator-table-app': IteratorDataTable
  },
  data() {
    return {
      svg: {
        mdiMapMarker,
        mdiClockOutline,
        mdiClockStart
      },
      numberOfRooms: null
    }
  }
}
</script>
