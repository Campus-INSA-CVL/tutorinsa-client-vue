<template lang="pug">
  v-stepper(v-model="stepper", vertical)
    v-form(autocomplete="on", @submit.prevent="signup()", ref="form", v-model="valid")
      v-stepper-step(:complete="stepper > 1", step="1", editable)
        span.
          #[span.text-capitalize créer] un compte

      v-stepper-content(step="1")
        v-card(elevation="0")
          v-card-text
            v-row
              v-col(cols="12", md="6")
                v-text-field(label="NOM", type="text", required, :prepend-inner-icon="svg.mdiAccount", outlined, clearable, v-model="editedItem.lastName", :rules="[rules.required, rules.noNumber]", autocomplete="given-name")
              v-col(colsl="12", md="6")
                v-text-field(label="Prénom", type="text", required, :prepend-inner-icon="svg.mdiAccountDetails", outlined, clearable, v-model="editedItem.firstName", :rules="[rules.required, rules.noNumber]", autocomplete="family-name")

            v-row
              v-col(cols="12")
                v-text-field(label="Email", type="email", required, :prepend-inner-icon="svg.mdiEmail", outlined, clearable, v-model="editedItem.email", :rules="[rules.required, rules.email]", autocomplete="email")

            v-row
              v-col(cols="12", md="6")
                v-text-field(label="Password", :type="showPassword ? 'text' : 'password'", required, :prepend-inner-icon="svg.mdiLock", outlined, clearable, v-model="editedItem.password", :rules="[rules.required, rules.password]", @click:append="showPassword = !showPassword", :append-icon="showPassword ? svg.mdiEye : svg.mdiEyeOff", autocomplete="new-password")
              v-col(cols="12", md="6")
                v-text-field(label="Confirmation du password", :type="showConfirmedPassword ? 'text' : 'password'", required, :prepend-inner-icon="confirmPassword === editedItem.password ? svg.mdiLockCheck : svg.mdiLockQuestion", outlined, clearable, v-model="confirmPassword", :rules="[rules.required, rules.password, rules.matchPassword]", @click:append="showConfirmedPassword = !showConfirmedPassword", :append-icon="showConfirmedPassword ? svg.mdiEye : svg.mdiEyeOff", autocomplete="new-password")

        v-row(justify="space-between", align="center")
          v-col(align="start")
            v-btn(depressed, @click="stepper = 2", :small="$vuetify.breakpoint.xs", color="primary") continuer

      v-stepper-step(:complete="stepper > 2" , step="2", editable) À propos de toi

      v-stepper-content(step="2")
        v-card(elevation="0")
          v-card-text
            v-row(justify="space-between")
              v-col(cols="12", md="6", align="center")
                v-select(label="Année", clearable, item-text="name", item-value="_id", :items="findYears().data" outlined, v-model="editedItem.yearId", required)
              v-col(cols="12", md="6")
                v-select(label="Département", clearable, item-text="name", item-value="_id", :items="findDepartments().data" outlined, v-model="editedItem.departmentId", required)

            v-row
              v-col(cols="12")
                v-select(label="Matière(s) préférée(s)", clearable, item-text="name", item-value="_id", :items="findSubjects().data", deletable-chips, chips, multiple, outlined, v-model="editedItem.favoriteSubjectsIds")

            v-row
              v-col(cols="12")
                v-select(label="Matière(s) en difficultée(s)", clearable, item-text="name", item-value="_id", :items="findSubjects().data", deletable-chips, chips, multiple, outlined, v-model="editedItem.difficultSubjectsIds")

            v-row(justify="space-around")
              v-col(cols="6")
                v-checkbox(label="Élève", v-model="editedItem.permissions", value="eleve")
              v-col(cols="6")
                v-checkbox(label="Tuteur", v-model="editedItem.permissions", value="tuteur")


        v-row
          v-col(align="start")
            v-btn(depressed, @click="stepper = 3", :small="$vuetify.breakpoint.xs", color="primary") continuer
          v-spacer
          v-col(align="end")
            v-btn(depressed, @click="stepper = 1", :small="$vuetify.breakpoint.xs") retour

      v-stepper-step(step="3") Vérification

      v-stepper-content(step="3")
        v-card(elevation="0")
          v-card-title
            div.
              #[span.text-uppercase {{ editedItem.lastName }}] #[span.text-capitalize {{ editedItem.firstName }}]
          v-card-subtitle.text-left {{editedItem.email}}
          v-card-text
            div.text-left.
              #[span.text-capitalize année]: {{year == null ? '' : year.name}}
            div.text-left.
              #[span.text-capitalize département]: {{department == null ? '' : department.name}}
            div(v-if="favoriteSubjects !== null").text-left.
              #[span.text-capitalize matière](s) préféré(s)
            ul(v-for="fav in favoriteSubjects")
              li.text-left {{fav.name}}
            div(v-if="favoriteSubjects !== null").text-left.
              #[span.text-capitalize matière](s) en difficulté(s)
            ul(v-for="dif in difficultSubjects")
              li.text-left {{dif.name}}
            div.text-left.
              #[span.text-capitalize rôle](s)
            ul(v-for="perm in editedItem.permissions")
              li.text-left {{perm}}
        v-row
          v-col(align="start")
            v-btn(depressed, type="submit", :small="$vuetify.breakpoint.xs", color="primary") terminer
          v-spacer
          v-col(align="end")
            v-btn(depressed, @click="stepper = 2", :small="$vuetify.breakpoint.xs") retour
    v-snackbar(v-model="snackbar", color="error", :timeout="5000", top)
      v-row.ma-0.pa-0
        v-col(cols="12", align="center").ma-0.pa-0
          v-icon(left) {{svg.mdiAlert}}
          template(v-if="error && error.code == 409").
            #[span.text-capitalize un] compte avec cet email existe déjà !
          span(v-else).
            #[span.text-capitalize il] semble que vous n'ayez pas rempli certaines informations.

</template>

<script>
import {
  mdiAccount,
  mdiEmail,
  mdiLock,
  mdiAccountDetails,
  mdiLockQuestion,
  mdiLockCheck,
  mdiEye,
  mdiEyeOff,
  mdiAlert
} from '@mdi/js'

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      error: {},
      snackbar: false,
      valid: true,
      showPassword: false,
      showConfirmedPassword: false,
      svg: {
        mdiAccount,
        mdiAccountDetails,
        mdiEmail,
        mdiLock,
        mdiLockCheck,
        mdiLockQuestion,
        mdiEye,
        mdiEyeOff,
        mdiAlert
      },
      stepper: 1,
      confirmPassword: '',
      editedItem: {
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        yearId: '',
        departmentId: '',
        favoriteSubjectsIds: [],
        difficultSubjectsIds: [],
        permissions: []
      },
      rules: {
        required: (v) => !!v || 'Requis',
        noNumber: (v) => !/\d/iu.test(v) || 'Cette valeur ne convient pas',
        email: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Ceci n'est pas une adresse mail",
        password: (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
            v
          ) ||
          'Doit contenir au moins 8 charactères dont 1 minuscule, 1 majuscule,  1 chiffre et 1 charactère spécial',
        matchPassword: (v) =>
          v === this.editedItem.password || 'Passwords non identiques'
      }
    }
  },
  computed: {
    ...mapGetters({
      findSubjects: 'subjects/find',
      findYears: 'years/find',
      findDepartments: 'departments/find'
    }),
    year() {
      const data = this.findYears({ query: { _id: this.editedItem.yearId } })
      return data.data ? data.data[0] : null
    },
    department() {
      const data = this.findDepartments({
        query: { _id: this.editedItem.departmentId }
      })
      return data.data ? data.data[0] : null
    },
    favoriteSubjects() {
      const ids = this.editedItem.favoriteSubjectsIds
      const data = this.findSubjects({
        query: { _id: { $in: ids } }
      })
      return data.data ? data.data : null
    },
    difficultSubjects() {
      const ids = this.editedItem.difficultSubjectsIds
      const data = this.findSubjects({
        query: { _id: { $in: ids } }
      })
      return data.data ? data.data : null
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
    signup() {
      this.$nuxt.$loading.start()
      if (this.$refs.form.validate()) {
        const { User } = this.$FeathersVuex.api
        const data = Object.assign({}, this.editedItem)
        const newUser = new User(data)
        newUser
          .create()
          .then((response) => {
            this.$nuxt.$loading.finish()
            this.$refs.form.reset()
            this.$router.push({ to: '/' })
          })
          .catch((error) => {
            this.$nuxt.$loading.finish()
            this.snackbar = true
            this.error = error
          })
      } else {
        this.$nuxt.$loading.finish()

        this.snackbar = true
      }
    }
  }
}
</script>
