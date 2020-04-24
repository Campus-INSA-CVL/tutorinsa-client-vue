<template lang="pug">
  v-card
    v-card-title #[span.text-capitalize.primary--text modification]&nbsp;d'un utilisateur
    v-card-text
      v-row
        v-col(cols="12", md="6")
          v-text-field(type="text", v-model="editedItem.firstName", outlined, clearable)
        v-col(cols="12", md="6")
          v-text-field(type="text", v-model="editedItem.lastName", outlined, clearable)

      v-row
        v-col(cols="12", md="6")
          v-select(clearable, label="Année", v-model="editedItem.yearId",:items="years", item-text="name", item-value="_id", outlined, :menu-props="{bottom: true, offsetY: true}")
        v-col(cols="12", md="6")
          v-select(clearable, label="Département", v-model="editedItem.departmentId", :items="departments", item-text="name", item-value="_id", outlined, :menu-props="{bottom: true, offsetY: true}")

      v-row
        v-col(cols="12", md="6")
          v-select(clearable, deletable-chips, chips, multiple, label="Matière(s) préférée(s)", v-model="editedItem.favoriteSubjectsIds",:items="subjects", item-text="name", item-value="_id", outlined, :menu-props="{bottom: true, offsetY: true}")
        v-col(cols="12", md="6")
          v-select(clearable, deletable-chips, chips, multiple, label="Matière(s) en difficutée(s)", v-model="editedItem.difficultSubjectsIds",:items="subjects", item-text="name", item-value="_id", outlined, :menu-props="{bottom: true, offsetY: true}")

      v-row(justify="space-around")
        v-col(cols="12")
          header.text-left #[span.text-capitalize permissions] de l'utilisateur
        v-checkbox(v-model="editedItem.permissions", label="Elève", value="eleve")
        v-checkbox(v-model="editedItem.permissions", label="Tuteur", value="tuteur")
        v-checkbox(v-model="editedItem.permissions", label="Admin", value="admin")


    v-card-actions
      v-spacer
      v-btn(@click="cancel", depressed, text) annuler les modifications
      v-btn(@click="save", depressed).primary enregistrer
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'EditUser',
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  async fetch() {
    try {
      const response = this.findSubjects()
      if (!response.data.length) {
        this.subjects = await this.Subjects()
      } else {
        this.subjects = response.data
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      EventBus.$emit('snackEvent', {
        color: 'error',
        message: 'Une erreur est survenue lors du chargement des matières',
        active: true,
        close: true
      })
    }
    try {
      const response = this.findDepartments()
      if (!response.data.length) {
        this.departments = await this.Departments()
      } else {
        this.departments = response.data
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      EventBus.$emit('snackEvent', {
        color: 'error',
        message: 'Une erreur est survenue lors du chargement des départements',
        active: true,
        close: true
      })
    }
    try {
      const response = this.findYears()
      if (!response.data.length) {
        this.years = await this.Years()
      } else {
        this.years = response.data
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      EventBus.$emit('snackEvent', {
        color: 'error',
        message: 'Une erreur est survenue lors du chargement des années',
        active: true,
        close: true
      })
    }

    this.editItem(this.item)
  },
  data() {
    return {
      subjects: null,
      years: null,
      departments: null,
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
  fetchOnServer: false,
  computed: {
    ...mapGetters({
      findSubjects: 'subjects/find',
      findYears: 'years/find',
      findDepartments: 'departments/find',
      findUsers: 'users/find'
    })
  },
  watch: {
    item(item, prev) {
      if (item) {
        this.editItem(item)
      }
    }
  },
  methods: {
    ...mapActions({
      Departments: 'departments/find',
      Years: 'years/find',
      Subjects: 'subjects/find'
    }),
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
    },
    cancel() {
      this.editItem(this.item)
    },
    save() {
      const Model = this.$FeathersVuex.api.User
      const data = Object.assign({}, this.editedItem)
      const patchModel = new Model({ id: this.editedId })
      patchModel.patch({ data })
    }
  }
}
</script>
