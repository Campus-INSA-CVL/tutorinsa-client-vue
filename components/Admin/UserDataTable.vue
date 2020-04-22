<template lang="pug">
  FeathersVuexFind(service="users", :query="{$limit: itemsPerPage, $skip: itemsPerPage * (page - 1)}", watch="query")
    section(slot-scope="{ items: users }")
      v-data-iterator(:items="users", :items-per-page.sync="itemsPerPage", :sort-by="sortBy.toLowerCase()", :sort-desc="sortDesc", :page="page", hide-default-footer, :search="search")
        template(v-slot:header)
          v-toolbar
            v-toolbar-title utilisateurs
            //v-text-field(v-model="search", clearable, single-line, hide-details, :prepend-icon="svg.mdiMagnify", label="recherche par courriel")

        template(v-slot:footer)
          v-row(align="center", justify="center").mt-2
            span.grey--text #[span.text-capitalize éléments] par page
            v-menu(offset-y)
              template(v-slot:activator="{on}")
                v-btn(text, v-on="on").ml-2.primary--text
                  span {{itemsPerPage}}
                  v-icon {{svg.mdiChevronDown}}
              v-list
                v-list-item(v-for="(number, index) in itemsPerPageArray", :key="index", @click="updateItemsPerPage(number)")
                  v-list-item-title {{number}}
            v-spacer
            span.mr-4.grey--text page {{page}} sur {{numberOfPages}}
            v-btn(fab, small, @click="formerPage", :disabled="page === 1").mr-1.primary
              v-icon {{svg.mdiChevronLeft}}
            v-btn(fab, small, @click="nextPage", :disabled="page === numberOfPages").ml-1.primary
              v-icon {{svg.mdiChevronRight}}

        template(v-slot:default="props")
          v-row
            v-col(v-for="(item, indice) in props.items", :key="item.email", cols="12", sm="6", md="4", lg="3")
              v-card
                v-card-title
                  div #[span.text-uppercase {{ item.lastName }}] #[span.text-capitalize {{ item.firstName }}]

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
                    v-icon(small) {{svg.mdiPencil}}
                  v-chip(color="red", small, @click="deleteItem(item)")
                    v-icon(small) {{svg.mdiDelete}}
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
import { mapGetters, mapActions } from 'vuex'

import {
  mdiPencil,
  mdiDelete,
  mdiMagnify,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight
} from '@mdi/js'

export default {
  components: {
    FeathersVuexFind
  },
  data() {
    return {
      search: '',
      sortBy: 'lastName',
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      itemsPerPageArray: [4, 8, 12],
      numberofItems: null,
      svg: {
        mdiPencil,
        mdiDelete,
        mdiMagnify,
        mdiChevronDown,
        mdiChevronLeft,
        mdiChevronRight
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
      findDepartments: 'departments/find',
      findUsers: 'users/find'
    }),
    numberOfPages() {
      return Math.ceil(this.numberofItems / this.itemsPerPage)
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  async mounted() {
    try {
      const response = await this.Users({ query: { $limit: 0 } })
      this.numberofItems = response.total
    } catch (error) {
      throw new Error(error.message)
    }
  },
  methods: {
    ...mapActions({
      Users: 'users/find'
    }),
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
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
