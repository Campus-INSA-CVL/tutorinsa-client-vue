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
      v-btn(color="primary", @click="editItem()", depressed) modifier
      v-btn(color="red", outlined, @click="deleteUser()") supprimer

  title-app(v-else, textCenter)
    | #[span.text-capitalize vous] n'avez pas accès à cette page !
    br
    | #[span.text-capitalize connectez] vous pour accéder à votre profil !
  v-dialog(v-model="dialog", max-width="500")
    edit-user-app(:item="user")
</template>

<script>
import EditUser from '@/components/User/EditUser'
import Title from '@/components/Misc/Title'

export default {
  name: 'User',
  components: {
    'title-app': Title,
    'edit-user-app': EditUser
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    editItem() {
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
    }
  }
}
</script>
