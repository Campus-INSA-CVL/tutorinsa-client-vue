<template lang="pug">
  v-container
    v-row
      v-col(cols="12", sm="6", md="4")
        SimpleDataTable(title="matières", service="subjects", modelName="Subject", :headers="headers")
      v-col(cols="12", sm="6", md="4")
        SimpleDataTable(title="années", service="years", modelName="Year", :headers="headers")
      v-col(cols="12", sm="6", md="4")
        SimpleDataTable(title="départements", service="departments", modelName="Department", :headers="headers")

      v-col(cols="12")
        UserDataTable

</template>

<script>
import SimpleDataTable from '@/components/SimpleDataTable'
import UserDataTable from '@/components/Admin/UserDataTable'

export default {
  components: {
    SimpleDataTable,
    UserDataTable
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
  },

  head() {
    return {
      title: 'Admin'
    }
  }
}
</script>
