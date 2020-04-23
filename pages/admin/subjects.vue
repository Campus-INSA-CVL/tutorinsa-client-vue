<template lang="pug">
  simple-table-app(title="matières", service="subjects", modelName="Subject", :headers="headers")
</template>

<script>
import SimpleDataTable from '@/components/Admin/SimpleDataTable'

export default {
  name: 'AdminSubjects',
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
