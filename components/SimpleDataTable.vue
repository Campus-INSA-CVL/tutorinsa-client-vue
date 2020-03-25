<template lang="pug">
  FeathersVuexFind(:service="service" :query="query"  :fetch-query="fetchQuery" :edit-scope="getPaginationInfo")

    section(slot-scope="{ items: items }")

      v-data-table(:items="items", :headers="headers", :fetch-query="fetchQuery", calculate-widths)

        template(v-slot:top)
          v-toolbar
            v-toolbar-title.text-capitalize.mr-4 {{ title }}
            v-divider(inset, vertical)
            v-spacer
            v-dialog( max-width="300", v-model="dialog")
              template(v-slot:activator="{on}")
                v-btn(depressed, color="primary--text", v-on="on")
                  v-icon mdi-plus
              v-card
                v-card-title {{formTitle}}
                v-card-text
                  v-text-field(v-model="editedItem.name", label="name")
                v-card-actions
                  v-spacer
                  v-btn(@click="close") annuler
                  v-btn(@click="save") enregistrer


        template(v-slot:item.actions="{item}")
          v-chip(color="primary", small, @click="editItem(item)").mr-2
            v-icon(small) mdi-pencil
          v-chip(color="red", small, @click="deleteItem(item)")
            v-icon(small) mdi-delete
</template>

<script>
import { FeathersVuexFind } from 'feathers-vuex'

export default {
  name: 'SimpleDataTable',
  components: {
    FeathersVuexFind
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      default: ''
    },
    modelName: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default() {
        return []
      }
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialog: false,
      editedId: -1,
      editedItem: {
        name: ''
      },
      defaultItem: {
        name: ''
      },
      ids: [],
      total: 0,
      limit: 20,
      skip: 0
    }
  },
  computed: {
    fetchQuery() {
      return Object.assign({}, this.query, {
        $limit: this.limit,
        $skip: this.skip
      })
    },
    formTitle() {
      return this.editedId === -1 ? `Nouveau item` : "Modifier l'item"
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  methods: {
    getPaginationInfo(scope) {
      const { queryInfo, pageInfo } = scope

      this.total = queryInfo.total
      if (pageInfo && pageInfo.ids) {
        this.ids = pageInfo.ids
      }
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.editedId = item._id
      this.dialog = true
    },

    deleteItem(item) {
      const Model = this.$FeathersVuex.api[this.modelName]
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
      const Model = this.$FeathersVuex.api[this.modelName]
      const data = Object.assign({}, this.editedItem)
      if (this.editedId === -1) {
        const newModel = new Model(data)
        newModel.create()
      } else {
        const patchModel = new Model({ id: this.editedId })
        patchModel.patch({ data })
      }
      this.close()
    }
  }
}
</script>
