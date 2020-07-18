<template lang="pug">
  simple-table-app(title="années", service="years", modelName="Year", :headers="headers")
</template>

<script>
import SimpleDataTable from '@/components/Admin/SimpleDataTable'

export default {
  name: 'AdminYears',
  components: {
    'simple-table-app': SimpleDataTable
  },
  data() {
    return {
      headers: [
        {
          text: 'nom',
          value: 'name'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'right',
          width: '45%'
        }
      ]
    }
  }
}
</script>
