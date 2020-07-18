<template lang="pug">
  simple-table-app(title="départements", service="departments", modelName="Department", :headers="headers")
</template>

<script>
import SimpleDataTable from '@/components/Admin/SimpleDataTable'

export default {
  name: 'AdminDepartments',
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
