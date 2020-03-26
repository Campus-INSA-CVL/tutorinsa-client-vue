<template lang="pug">
  FeathersVuexFind(service="users", :query="{}")
    section(slot-scope="{ items: users }")
      v-data-iterator(:items="users")
        template(v-slot:header)
          v-toolbar()
            v-toolbar-title utilisateurs
        template(v-slot:default="props")
          v-row
            v-col(v-for="item in props.items", :key="item.email", cols="12", sm="6", md="4", lg="3")
              v-card
                v-card-title
                  div.
                    #[span.text-uppercase {{ item.lastName }}] #[span.text-capitalize {{ item.firstName }}]
                v-card-subtitle {{item.email}}
                v-card-text
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
                v-card-actions
                  v-spacer
                  v-chip(color="primary", small, @click="editItem(item)").mr-2
                    v-icon(small) {{mdiPencil}}
                  v-chip(color="red", small, @click="deleteItem(item)")
                    v-icon(small) {{mdiDelete}}
      v-dialog(v-model="dialog")
        v-card
          v-card-title modifier l'item
          v-card-text
            v-text-field(type="text", v-model="editedItem.firstName")
            v-text-field(type="text", v-model="editedItem.lastName")

            v-select(clearable, label="année", v-model="editedItem.yearId",:items="findYears().data", item-text="name", item-value="_id")

            v-select(clearable, label="département", v-model="editedItem.departmentId", :items="findDepartments().data", item-text="name", item-value="_id")

            v-select(clearable, deletable-chips, chips, multiple, label="matière(s) préférée(s)", v-model="editedItem.favoriteSubjectsIds",:items="findSubjects().data", item-text="name", item-value="_id")

            v-select(clearable, deletable-chips, chips, multiple, label="matière(s) en difficutée(s)", v-model="editedItem.difficultSubjectsIds",:items="findSubjects().data", item-text="name", item-value="_id")

            v-checkbox(v-model="editedItem.permissions", label="eleve", value="eleve")
            v-checkbox(v-model="editedItem.permissions", label="tuteur", value="tuteur")

          v-card-actions
            v-spacer
            v-btn(@click="close") annuler
            v-btn(@click="save") enregistrer

</template>

<script>
import { FeathersVuexFind } from 'feathers-vuex'
import { mapGetters } from 'vuex'

import { mdiPencil, mdiDelete } from '@mdi/js'

export default {
  components: {
    FeathersVuexFind
  },
  data() {
    return {
      svg: {
        mdiPencil,
        mdiDelete
      },
      dialog: false,
      editedId: -1,
      editedItem: {
        firstName: '',
        lastName: '',
        yearId: '',
        departmentId: [],
        favoriteSubjectsIds: [],
        difficultSubjectsIds: [],
        permissions: []
      },
      defaultItem: {
        firstName: '',
        lastName: '',
        yearId: '',
        departmentId: [],
        favoriteSubjectsIds: [],
        difficultSubjectsIds: [],
        permissions: []
      }
    }
  },
  computed: {
    ...mapGetters({
      findSubjects: 'subjects/find',
      findYears: 'years/find',
      findDepartments: 'departments/find'
    })
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  methods: {
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.editedItem.yearId = item.year._id
      this.editedItem.departmentId = item.department._id
      this.editedItem.favoriteSubjectsIds = item.favoriteSubjects.map(
        (fav) => fav._id
      )
      this.editedItem.difficultSubjectsIds = item.difficultSubjects.map(
        (dif) => dif._id
      )
      this.editedId = item._id
      this.dialog = true
    },
    deleteItem(item) {
      const Model = this.$FeathersVuex.api.User
      const deleteModel = new Model({ id: item._id })
      confirm('Êtes vous sûr de vouloir supprimer ces données ?') &&
        deleteModel.remove()
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedId = -1
      }, 300)
    },

    save() {
      const Model = this.$FeathersVuex.api.User
      const data = Object.assign({}, this.editedItem)
      const patchModel = new Model({ id: this.editedId })
      patchModel.patch({ data })
      this.close()
    }
  }
}
</script>
