<template lang="pug">
div
  v-card(outlined, v-if="user")
    v-card-title.display-1.
      #[span.text-uppercase {{user.lastName}}]&nbsp;#[span.text-capitalize {{user.firstName}}]
    v-card-subtitle.
      #[span {{user.email}}]
    v-card-text.subtitle-1
      v-row(no-gutters)
        v-col(cols="12", md="6").
          #[span.text-capitalize année]: {{user.year.name}}
        v-col(cols="12", md="6").
          #[span.text-capitalize département]: {{user.department.name}}
      v-row(no-gutters)
        v-col(cols="12", md="6")
          template.
            #[span.text-capitalize matière](s)&nbsp;préférée(s)
          ul
            li(v-for="item in user.favoriteSubjects") {{item.name}}
        v-col(cols="12", md="6")
          template.
            #[span.text-capitalize matière](s)&nbsp;en difficultée(s)
          ul
            li(v-for="item in user.difficultSubjects") {{item.name}}
      v-row
        v-col(cols="12")
          template.
            #[span.text-capitalize rôle](s)
          ul
            li(v-for="item in user.permissions") {{item}}
      v-row(no-gutters).caption.mt-0
        v-col(cols="12").
          #[span.text-capitalize mise] à jour le {{ $moment(user.updatedAt).format('LL [à] LT') }} ({{ $moment(user.updatedAt).fromNow() }})
        v-col(cols="12").
          #[span.text-capitalize crée] le {{ $moment(user.createdAt).format('LL [à] LT') }} ({{ $moment(user.createdAt).fromNow() }})

    v-card-actions
      v-spacer
      v-btn(color="primary", @click="editItem()") modifier
      v-btn(color="red", outlined, @click="deleteUser()") supprimer

  title-app(v-else, textCenter)
    | #[span.text-capitalize vous] n'avez pas accès à cette page !
    br
    | #[span.text-capitalize connectez] vous pour accéder à votre profil !
  v-dialog(v-model="dialog", max-width="500")
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
import { mapGetters, mapActions } from 'vuex'

import Title from '@/components/Misc/Title'

export default {
  components: {
    'title-app': Title
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
  async mounted() {
    if (this.findSubjects().data.length === 0) {
      await this.Subjects({ query: {}, paginate: false })
    }
    if (this.findYears().data.length === 0) {
      await this.Years({ query: {}, paginate: false })
    }
    if (this.findDepartments().data.length === 0) {
      await this.Departments({ query: {}, paginate: false })
    }
  },
  methods: {
    ...mapActions({
      Subjects: 'subjects/find',
      Years: 'years/find',
      Departments: 'departments/find'
    }),
    editItem() {
      this.editedItem = Object.assign({}, this.user)
      this.editedItem.yearId = this.user.year._id
      this.editedItem.departmentId = this.user.department._id
      this.editedItem.favoriteSubjectsIds = this.user.favoriteSubjects.map(
        (fav) => fav._id
      )
      this.editedItem.difficultSubjectsIds = this.user.difficultSubjects.map(
        (dif) => dif._id
      )
      this.editedId = this.user._id
      this.dialog = true
    },
    deleteUser() {
      const Model = this.$FeathersVuex.api.User
      const deleteModel = new Model({ id: this.user._id })
      confirm(
        'Êtes vous sûr de vouloir supprimer votre compte ? 😥 Cette action est irréversible !'
      ) && deleteModel.remove()
      this.$router.push({ to: '/' })
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
