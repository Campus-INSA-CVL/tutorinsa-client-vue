<template lang="pug">
  v-stepper(v-model="stepper", vertical).elevation-4
    v-form(autocomplete="on", @submit.prevent="signup()", ref="form", v-model="valid")

      v-stepper-step(:complete="stepper > 1", step="1", editable)
        span #[span.text-capitalize créer] un compte

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
            v-btn(depressed, @click="stepper = 2", :small="$vuetify.breakpoint.xs", color="primary", :disabled="createAccount") continuer

      v-stepper-step(:complete="stepper > 2" , step="2", :editable="!createAccount") À propos de toi

      v-stepper-content(step="2")
        v-card(elevation="0")
          v-card-text
            v-row(justify="space-between")
              v-col(cols="12", md="6", align="center")
                v-select(label="Année", clearable, item-text="name", item-value="_id", :items="years" outlined, v-model="editedItem.yearId", required, :loading="$fetchState.pending", :disabled="$fetchState.pending", :menu-props="{bottom: true, offsetY: true}", :rules="[rules.required]")

              v-col(cols="12", md="6")
                v-select(label="Département", clearable, item-text="name", item-value="_id", :items="departments" outlined, v-model="editedItem.departmentId", required, :loading="$fetchState.pending", :disabled="$fetchState.pending", :menu-props="{bottom: true, offsetY: true}", :rules="[rules.required]")

            v-row
              v-col(cols="12")
                v-select(label="Matière(s) préférée(s)", clearable, item-text="name", item-value="_id", :items="subjects", deletable-chips, chips, multiple, outlined, v-model="editedItem.favoriteSubjectsIds", :loading="$fetchState.pending", :disabled="$fetchState.pending", :menu-props="{bottom: true, offsetY: true}")

            v-row
              v-col(cols="12")
                v-select(label="Matière(s) en difficultée(s)", clearable, item-text="name", item-value="_id", :items="findSubjects().data", deletable-chips, chips, multiple, outlined, v-model="editedItem.difficultSubjectsIds", :loading="$fetchState.pending", :disabled="$fetchState.pending", :menu-props="{bottom: true, offsetY: true}")

            v-row(justify="space-around")
              v-col(cols="12")
                header.text-left #[span.text-capitalize votre] status
              v-checkbox(label="Élève", v-model="editedItem.permissions", value="eleve")
              v-checkbox(label="Tuteur", v-model="editedItem.permissions", value="tuteur")


        v-row
          v-col(align="start")
            v-btn(depressed, @click="stepper = 3", :small="$vuetify.breakpoint.xs", color="primary", :disabled="aboutYou") continuer
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
            v-btn(depressed, type="submit", :small="$vuetify.breakpoint.xs", color="primary", :disabled="!valid") terminer
          v-spacer
          v-col(align="end")
            v-btn(depressed, @click="stepper = 2", :small="$vuetify.breakpoint.xs") retour
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

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'SignupForm',
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
  },
  fetchOnServer: false,
  data() {
    return {
      subjects: null,
      years: null,
      departments: null,
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
    },
    createAccount() {
      return (
        !this.editedItem.lastName ||
        !this.editedItem.firstName ||
        !this.editedItem.email ||
        !this.editedItem.password ||
        !this.confirmPassword
      )
    },
    aboutYou() {
      return (
        !this.editedItem.yearId ||
        !this.editedItem.departmentId ||
        !this.editedItem.permissions.length
      )
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
            // eslint-disable-next-line
            console.error(error)
            const message =
              error.code === 409
                ? 'un compte avec cet email existe déjà !'
                : 'Une erreur est survenue lors du chargement des années'
            this.$nuxt.$loading.finish()
            EventBus.$emit('snackEvent', {
              color: 'error',
              message,
              active: true,
              close: true
            })
          })
      } else {
        this.$nuxt.$loading.finish()
        EventBus.$emit('snackEvent', {
          color: 'error',
          message:
            "Il semble que vous n'ayez pas rempli certaines informations.",
          active: true,
          close: true
        })
      }
    }
  }
}
</script>
