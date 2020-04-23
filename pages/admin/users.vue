<template lang="pug">
  iterator-table-app(:numberOfItems="numberOfUsers", service="users", modelName="User", editable, deletable)
    template(v-slot:title="{ item }") #[span.text-uppercase {{ item.lastName }}]&nbsp;#[span.text-capitalize {{ item.firstName }}]

    template(v-slot:subtitle="{ item }") {{item.email}}

    template(v-slot:text="{ item }")
      div année: {{item.year.name}}
      div departement: {{item.department.name}}
      div matières préférés
      ul(v-for="fav in item.favoriteSubjects")
        li {{fav.name}}
      div matières en difficultés
      ul(v-for="dif in item.difficultSubjects")
        li {{dif.name}}
      div rôles
      ul(v-for="perm in item.permissions")
        li {{perm}}
      div mise à jour le {{ $moment(item.updatedAt).format('LL [à] LT') }} ({{ $moment(item.updatedAt).fromNow() }})
      div créé le {{ $moment(item.createdAt).format('LL [à] LT') }} ({{ $moment(item.createdAt).fromNow() }})

    template(v-slot:edit="{ item }")
      edit-user-app(:item="item")
</template>

<script>
import { mapActions } from 'vuex'

import IteratorDataTable from '@/components/Admin/IteratorDataTable'
import EditUser from '@/components/User/EditUser'

export default {
  name: 'AdminUsers',
  components: {
    'iterator-table-app': IteratorDataTable,
    'edit-user-app': EditUser
  },
  data() {
    return {
      numberOfUsers: null
    }
  },
  async mounted() {
    try {
      const response = await this.Users({ query: { $limit: 0 } })
      this.numberOfUsers = response.total
    } catch (error) {
      throw new Error(error.message)
    }
  },
  methods: {
    ...mapActions({
      Users: 'users/find'
    })
  }
}
</script>
