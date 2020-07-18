<template lang="pug">
  v-dialog(v-model="dialog", fullscreen)
    template(v-slot:activator="{on}")
      v-btn(v-on="on", depressed, :outlined="$vuetify.breakpoint.xs", :x-small="$vuetify.breakpoint.xs", :fab="$vuetify.breakpoint.xs", :class="$attrs.margin")
        v-icon(:left="$vuetify.breakpoint.smAndUp") {{patchable ? svg.mdiTextBoxCheckOutline : svg.mdiTextBoxPlusOutline }}
        span(v-if="$vuetify.breakpoint.smAndUp") {{ title }}
    v-card
      v-row(no-gutters)
        v-col
          transition(name="fade", mode="out-in")
            v-card(flat, tile, v-if="$fetchState.pending")
              v-card-title.font-weight-bold
                v-row
                  v-col(cols="12", align="center")
                    div #[span.text-capitalize chargment] des données...
                  v-col(cols="12", align="center")
                    v-progress-circular(:size="50", indeterminate).primary--text
            v-card(flat, tile, v-else)
              v-form(@submit.prevent, ref="FormPost", v-model="valid")
                v-card-title.font-weight-bold
                  v-row(no-gutters, justify="center")
                    v-col(cols="12", sm="10", md="8", lg="6", align="center")
                      v-row(no-gutters, justify="space-around")
                        v-col(cols="10", align="start")
                          div #[span.text-capitalize nouvelle]&nbsp;#[span(:class="colorPost + '--text'").text-uppercase {{editedItem.type === 'eleve' ? 'demande' : 'offre'}}]&nbsp;de tutorat
                        v-col(cols="2", align="end")
                          v-btn(@click="close()", depressed, icon)
                            v-icon(:color="colorPost") {{svg.mdiClose}}
                v-card-text().pb-0
                  v-row(justify="center", dense)
                    v-col(cols="12", sm="10", md="8", lg="6", align="center")
                      header.text-left #[span.text-capitalize type] de l'annonce
                      v-radio-group(v-model="editedItem.type", row, :rules="[rules.required]", :disabled="patchable")
                        v-row(justify="center")
                          v-radio(label="Tuteur", value="tuteur", :color="colorPost", :disabled="!userPermissions('tuteur')").font-weight-bold
                          v-radio(label="Élève", value="eleve", :color="colorPost", :disabled="!userPermissions('eleve')").font-weight-bold

                      header.text-left #[span.text-capitalize campus] de l'annonce
                      v-radio-group(v-model="editedItem.campus", row, :rules="[rules.required, rules.campus]")
                        v-row(justify="center")
                          v-radio(label="BOURGES", value="bourges", :color="colorPost").font-weight-bold
                          v-radio(label="BLOIS", value="blois", :color="colorPost").font-weight-bold

                      v-row(dense, justify="center")
                        v-col(cols="12", align="center")
                          v-select(label="Matière", clearable, :items="findSubjects({query: {$sort: {name: 1}}}).data", outlined, item-text="name", item-value="_id", :color="colorPost", :item-color="colorPost", :menu-props="{bottom: true, offsetY: true}", v-model="editedItem.subjectId", :rules="[rules.required]")

                        v-col(cols="12", align="center")
                          v-textarea(outlined, label="Commentaire", clearable, auto-grow, counter=220, :placeholder="editedItem.type === 'tuteur' ? 'Décrivez ici ce que vous allez faire durant votre séance !' : 'Décrivez ici ce que vous aimeriez apprendre !' ", :color="colorPost", rows=3, v-model="editedItem.comment", :rules="[rules.required, rules.commentLength]")

                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-text-field(:color="colorPost", outlined, clearable, label="Nombre de tuteurs", :rules="[rules.required, rules.min, rules.maxTutors]", v-model="editedItem.tutorsCapacity", type="number")

                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-text-field(:color="colorPost", outlined, clearable, label="Nombre d'élèves", :rules="[rules.required, rules.min, rules.maxStudents]", v-model="editedItem.studentsCapacity", type="number")

                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-menu(ref="dateMenu", :close-on-content-click="false", v-model="dateMenu", transition="slide-y-transition", :return-value.sync="editedItem.date",  min-width="290px", offset-y, bottom, origin="bottom center", :nudge-bottom="-20")
                            template(v-slot:activator="{on}")
                              v-text-field(v-on="on", readonly, :prepend-inner-icon="svg.mdiCalendar", :color="colorPost", outlined, @click:clear="editedItem.date = null", :value="formattedDate", clearable, label="Choisissez une date", :rules="[rules.required, rules.isDate]", :disabled="!editedItem.subjectId")
                            v-date-picker(v-if="dateMenu", v-model="editedItem.date", no-title, :color="colorPost", :allowed-dates="allowedDates", :first-day-of-week="1")
                              v-spacer
                              v-btn(text @click="dateMenu = false", color="") Cancel
                              v-btn(text, @click="$refs.dateMenu.save(editedItem.date)", :color="colorPost") OK


                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-select(label="Choisissez une salle", clearable, :items="filteredRooms", outlined, item-text="name", item-value="_id", :prepend-inner-icon="svg.mdiMapMarker", :color="colorPost", :disabled="!editedItem.date || !editedItem.campus", no-data-text="Aucune salle de disponible", v-model="editedItem.roomId", :menu-props="{bottom: true, offsetY: true}", validate-on-blur, :rules="[rules.required]")
                            template(v-slot:selection="{ item }").
                              #[span.text-uppercase {{item.name}}]&nbsp;#[span.text-capitalize ({{item.campus}})]
                            template(v-slot:item="{ item, on, attrs}")
                              v-list-item(v-on="on", :aria-selected="attrs['aria-selected']", :role="attrs['role']", :inputValue="attrs['inputValue']", :id="attrs['id']", :color="colorPost", :key="attrs['id']").text-uppercase {{item.name}}


                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-menu(ref="startMenu", :close-on-content-click="false", v-model="startMenu", offset-y,  transition="slide-y-reverse-transition", :return-value.sync="editedItem.time", top, :nudge-top="10", origin="bottom center")
                            template(v-slot:activator="{on}")
                              v-text-field(v-on="on", readonly, :prepend-inner-icon="svg.mdiClockOutline", v-model="editedItem.time", outlined, :disabled="!editedItem.roomId", label="Début du tutorat", :color="colorPost", :rules="[rules.required]")
                            v-time-picker(v-if="startMenu", allowed-seconds=false, format="24hr", full-width, v-model="editedItem.time",  @click:minute="$refs.startMenu.save(editedItem.time)", :color="colorPost", :min="minStartTimePicker", :max="maxStartTimePicker")



                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-menu(ref="durationMenu", :close-on-content-click="false", v-model="durationMenu", offset-y,  transition="slide-y-reverse-transition", :return-value.sync="editedItem.duration", top, :nudge-top="10", origin="bottom center")
                            template(v-slot:activator="{on}")
                              v-text-field(v-on="on", readonly, :prepend-inner-icon="svg.mdiClockStart ", v-model="editedItem.duration", outlined, label="Durée du tutorat", :disabled="!editedItem.time", :color="colorPost", :rules="[rules.required]")
                            v-time-picker(v-if="durationMenu", allowed-seconds=false, format="24hr", full-width, v-model="editedItem.duration",  @click:minute="$refs.durationMenu.save(editedItem.duration)", :color="colorPost", :max="maxDurationTime", min="00:30")

                v-card-actions
                  v-row(dense, justify="center")
                    v-col(cols="12", sm="10", md="8", lg="6", align="end")
                      v-btn(text, @click="cancel").mr-4 annuler
                      v-btn(:color="colorPost", depressed, @click="save") {{ patchable ? 'modifier' : 'créer' }}

          v-card(flat, tile, v-if="$vuetify.breakpoint.smAndUp && (futurePosts && futurePosts.length > 0)")
            v-card-title.font-weight-bold
              v-row(no-gutters, justify="center")
                v-col(cols="12", sm="10", md="8", lg="6", align="center")
                  v-row(no-gutters, justify="space-around")
                    v-col(cols="12", align="start")
                      div(v-show="editedItem.type === 'tuteur'") #[span.text-capitalize autres]&nbsp;offres du {{formattedDate}}
                      div(v-show="editedItem.type === 'eleve'") #[span.text-capitalize autres]&nbsp;#[span.text-uppercase.primary--text offres]&nbsp;et&nbsp;#[span.text-uppercase.eleve--text demandes]&nbsp;pour : {{getSubject(editedItem.subjectId).name}}
            v-card-text
              v-row
                v-col(cols="12", sm="6", lg="4",v-for="(post, index) in futurePosts", :key="index", align-self="center")
                  preview-post-app(:post="post", shareBtn, hoverProp)
              div {{rooms}}
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'

import {
  mdiTextBoxPlusOutline,
  mdiTextBoxCheckOutline,
  mdiClockOutline,
  mdiCalendar,
  mdiMapMarker,
  mdiClockStart,
  mdiClose
} from '@mdi/js'

import { mapGetters, mapActions } from 'vuex'

import { EventBus } from '@/utils/event-bus'

import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'FormPost',
  components: {
    'preview-post-app': PreviewPost
  },
  mixins: [
    makeFindMixin({ service: 'rooms', watch: true }),
    makeFindMixin({ service: 'posts', watch: true })
  ],
  inheritAttrs: false,
  props: {
    toPatchPost: {
      type: Object,
      default: () => {}
    }
  },
  async fetch() {
    try {
      let response = null
      response = await this.findSubjects()
      if (!response.data.length) {
        await this.Subjects()
      }
    } catch (error) {
      EventBus.$emit('snackEvent', {
        color: 'error',
        message: 'Une erreur est survenue lors du chargement des matières',
        active: true,
        close: true
      })
    }
  },
  data() {
    return {
      svg: {
        mdiTextBoxPlusOutline,
        mdiTextBoxCheckOutline,
        mdiClockOutline,
        mdiCalendar,
        mdiMapMarker,
        mdiClockStart,
        mdiClose
      },
      rules: {
        required: (v) => !!v || 'Requis',
        type: (v) => ['eleve', 'tuteur'].includes(v) || 'Type inconnu',
        campus: (v) => ['bourges', 'blois'].includes(v) || 'Campus inconnu',
        commentLength: (v) =>
          (typeof v === 'string' && v.length < 220) ||
          'Votre texte est trop long !',
        isDate: () =>
          this.$moment(this.editedItem.date).isValid() || 'Date non valide',
        min: (v) => v >= 1 || 'Au moins 1',
        maxTutors: (v) => v <= 5 || 'Au maximum 5',
        maxStudents: (v) => v <= 25 || 'Au maximum 20'
      },
      title: 'créer une annonce',
      patchable: false,
      dialog: false,
      valid: true,
      durationMenu: false,
      dateMenu: false,
      startMenu: false,
      editedItem: {
        campus: null,
        date: null,
        subjectId: '',
        comment: '',
        duration: '',
        time: '',
        type: '',
        roomId: null,
        studentsCapacity: null,
        tutorsCapacity: null
      },
      resetItem: {
        campus: null,
        date: null,
        subjectId: '',
        comment: '',
        duration: '',
        time: '',
        type: '',
        roomId: null,
        studentsCapacity: null,
        tutorsCapacity: null
      },
      limit: 50,
      skip: 0
    }
  },
  fetchOnServer: false,
  computed: {
    ...mapGetters({
      user: 'auth/user',
      findSubjects: 'subjects/find',
      getSubject: 'subjects/get',
      getRoom: 'rooms/get',
      findRoom: 'rooms/find'
    }),
    filteredRooms() {
      const roomsIds = this.rooms.map((room) => room._id)
      const filteredPosts = this.posts.filter(
        (post) => post.room.campus === this.editedItem.campus
      )
      const postsRoomIds = filteredPosts.map((post) => post.room?._id)
      const diff = this.arrayDiff(roomsIds, postsRoomIds)
      if (this.toPatchPost) {
        diff.push(this.editedItem.roomId)
      }
      return this.findRoom({ query: { _id: { $in: diff } }, $$limit: 50 }).data
    },
    postsQuery() {
      const startAt = this.$moment.utc(this.editedItem.date)
      return {
        startAt: {
          $gte: startAt.startOf('day').format(),
          $lte: startAt.endOf('day').format()
        }
      }
    },
    postsParams() {
      const query = Object.assign({}, this.postsQuery, { $limit: this.limit })
      return {
        query,
        qid: 'posts'
      }
    },
    postsQueryWhen() {
      if (!this.editedItem.date) {
        return false
      }

      if (this.postsPaginationData.posts) {
        const queryString = JSON.stringify(this.postsQuery)
        const queryKeys = Object.keys(this.postsPaginationData.posts)
        if (queryKeys.includes(queryString)) {
          const pageIdString = `{"$limit":${this.limit},"$skip":${this.skip}}`
          const pageIdKeys = Object.keys(
            this.postsPaginationData.posts[queryString]
          )
          if (pageIdKeys.includes(pageIdString)) {
            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    roomsQuery() {
      const campus = this.editedItem.campus
      const date = this.editedItem.date
      const day = this.$moment.weekdays(this.$moment(date).day())

      return {
        campus,
        day
      }
    },
    roomsParams() {
      const query = Object.assign({}, this.roomsQuery, { $limit: this.limit })
      return {
        query,
        qid: 'rooms'
      }
    },
    roomsQueryWhen() {
      if (!this.editedItem.date) {
        return false
      }

      if (this.roomsPaginationData.rooms) {
        const queryString = JSON.stringify(this.roomsQuery)
        const queryKeys = Object.keys(this.roomsPaginationData.rooms)
        if (queryKeys.includes(queryString)) {
          const pageIdString = `{"$limit":${this.limit},"$skip":${this.skip}}`
          const pageIdKeys = Object.keys(
            this.roomsPaginationData.rooms[queryString]
          )
          if (pageIdKeys.includes(pageIdString)) {
            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    colorPost() {
      return this.editedItem.type === 'eleve' ? 'eleve' : 'primary'
    },
    formattedDate() {
      return this.editedItem.date
        ? this.$moment(this.editedItem.date).format('dddd DD MMMM YYYY')
        : ''
    },
    minStartTimePicker() {
      const roomId = this.editedItem.roomId
      const room = this.getRoom(roomId)
      let date = this.$moment.utc()
      const startAt = this.$moment.utc(room.startAt)
      date.hours(startAt.hours())
      date.minutes(startAt.minutes())
      date = this.$moment(date.format()).format('HH[:]mm')
      return date
    },
    maxStartTimePicker() {
      const roomId = this.editedItem.roomId
      const room = this.getRoom(roomId)
      let date = this.$moment.utc()
      const endAt = this.$moment.utc(room.endAt)
      date.hours(endAt.hours())
      date.minutes(endAt.minutes())
      date = this.$moment(date.format())
        .subtract(30, 'minutes')
        .format('HH[:]mm')
      return date
    },
    maxDurationTime() {
      const roomId = this.editedItem.roomId
      const room = this.getRoom(roomId)
      const time = this.editedItem.time.split(':')
      const hours = time[0]
      const minutes = time[1]
      const endAtRoom = this.$moment
        .utc()
        .hours(this.$moment.utc(room.endAt).hours())
        .minutes(this.$moment.utc(room.endAt).minutes())
        .seconds(0)
      const deltaTime = this.$moment(endAtRoom.format())
        .subtract(hours, 'hours')
        .subtract(minutes, 'minutes')
      const deltaTimeMinutes = deltaTime.hours() * 60 + +deltaTime.minutes()
      return this.$moment
        .utc(0)
        .add(deltaTimeMinutes, 'minutes')
        .format('HH[:]mm')
    },
    dateTimeTutorat() {
      const date = this.$moment(this.editedItem.date)
      const time = this.$moment(this.editedItem.time, 'LT')
      date.hours(time.hours())
      date.minutes(time.minutes())
      return date
    },
    futurePosts() {
      // let posts = null
      // if (this.editedItem.type === 'tuteur') {
      //   const date = this.$moment.utc(this.editedItem.date).format()
      //   const afterDate = this.$moment
      //     .utc(this.editedItem.date)
      //     .add(1, 'day')
      //     .format()
      //   const calendars = this.findCalendars({
      //     query: { startAt: { $gte: date, $lte: afterDate } }
      //   })
      //   const postsId = []
      //   calendars.data.forEach((calendar) => {
      //     const slots = calendar.slots
      //     if (slots) {
      //       slots.forEach((slot) => {
      //         if (!postsId.includes(slot.postId)) {
      //           postsId.push(slot.postId)
      //         }
      //       })
      //     }
      //   })
      //   posts = this.findPosts({
      //     query: { _id: { $in: postsId }, type: this.editedItem.type }
      //   }).data
      // } else if (this.editedItem.type === 'eleve') {
      //   posts = this.findPosts({
      //     query: {
      //       'subject._id': this.editedItem.subjectId,
      //       $sort: {
      //         date: 1
      //       }
      //     }
      //   }).data
      // }

      return []
    }
  },
  watch: {
    dialog(value) {
      if (value) {
        window.addEventListener('keydown', this.handleKeys)
      }
    },
    'editedItem.type'(type) {
      if (!this.patchable) {
        this.cancel()
        this.editedItem.type = type
      }
    },
    '$route.path'() {
      this.close()
    },
    'editedItem.roomId'(roomId) {
      if (!this.patchable) {
        if (roomId) {
          const room = this.getRoom(roomId)
          let date = this.$moment.utc()
          const startAt = this.$moment.utc(room.startAt)
          date.hours(startAt.hours())
          date.minutes(startAt.minutes())
          date = this.$moment(date.format()).format('HH[:]mm')
          this.editedItem.time = date
        } else {
          this.editedItem.time = null
        }
      }
    },
    'editedItem.time'(time) {
      if (!this.patchable) {
        if (time) {
          this.editedItem.duration = this.maxDurationTime
        } else {
          this.editedItem.duration = null
        }
      }
    }
  },
  mounted() {
    if (this.toPatchPost?._id) {
      this.addPatchPost()
    }
  },
  methods: {
    ...mapActions({
      Subjects: 'subjects/find',
      Rooms: 'rooms/find'
    }),
    addPatchPost() {
      this.patchable = true
      this.title = "éditer l'annonce"
      this.editedItem.type = this.toPatchPost.type
      this.editedItem.campus = this.toPatchPost.room.campus
      this.editedItem.time = this.$moment(this.toPatchPost.startAt).format(
        'HH[:]mm'
      )
      this.editedItem.subjectId = this.toPatchPost.subjectId
      this.editedItem.comment = this.toPatchPost.comment
      const hours = Math.trunc(this.toPatchPost.duration / 60)
      const minutes = this.toPatchPost.duration - 60 * hours
      this.editedItem.duration = `${hours < 10 ? '0' + hours : hours}:${
        minutes < 10 ? '0' + minutes : minutes
      }`
      this.editedItem.date = this.$moment(this.toPatchPost.startAt).format(
        'YYYY-MM-DD'
      )
      this.editedItem.roomId = this.toPatchPost.roomId
      this.editedItem.studentsCapacity = this.toPatchPost.studentsCapacity
      this.editedItem.tutorsCapacity = this.toPatchPost.tutorsCapacity
    },
    arrayDiff(a1, a2) {
      const a = []
      const diff = []

      for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true
      }

      for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
          delete a[a2[i]]
        } else {
          a[a2[i]] = true
        }
      }

      for (const k in a) {
        diff.push(k)
      }

      return diff
    },
    handleKeys(e) {
      if (e.keyCode === 13 && e.ctrlKey) {
        e.preventDefault()
        this.save()
      }
    },
    userPermissions(type) {
      return (
        this.user?.permissions.includes(type) ||
        this.user?.permissions.includes('admin')
      )
    },
    allowedDates(val) {
      return (
        this.$moment()
          .subtract(1, 'days')
          .format() < this.$moment(val).format()
      )
    },
    cancel() {
      if (this.toPatchPost) {
        this.addPatchPost()
      } else {
        Object.assign(this.editedItem, this.resetItem)
        this.$refs.FormPost.reset()
      }
    },
    close() {
      window.removeEventListener('keydown', this.handleKeys)
      this.dialog = false
    },
    save() {
      this.$nuxt.$loading.start()
      if (this.$refs.FormPost.validate()) {
        let date
        let duration
        if (this.editedItem.type === 'tuteur') {
          date = this.$moment.utc(this.editedItem.date)
          const timeDate = this.$moment.utc(
            this.$moment(this.editedItem.time, 'LT').format()
          )

          date.hours(timeDate.hours())
          date.minutes(timeDate.minutes())
          console.log('date:', date)

          console.log('this.editedItem.duration:', this.editedItem.duration)
          duration = this.$moment.utc(0)
          const timeDuration = this.$moment.utc(
            this.$moment.utc(this.editedItem.duration, 'LT').format()
          )
          console.log('timeDuration:', timeDuration)
          duration = +timeDuration.minutes() + +timeDuration.hours() * 60
        }

        const { Post } = this.$FeathersVuex.api
        const data = Object.assign({}, this.editedItem)
        data.studentsCapacity = Number(data.studentsCapacity)
        data.tutorsCapacity = Number(data.tutorsCapacity)

        if (this.editedItem.type === 'tuteur') {
          data.duration = duration
          data.startAt = date.format()
        }
        if (this.patchable) {
          const patchPost = new Post({ ...data, id: this.toPatchPost._id })
          console.log('patchPost:', patchPost)
          patchPost
            .patch()
            .then((response) => {
              this.$nuxt.$loading.finish()
              EventBus.$emit('snackEvent', {
                color: 'success',
                active: true,
                message: 'Le post a été modifié avec succès',
                close: true
              })
              this.cancel()
              this.close()
            })
            .catch((error) => {
              this.$nuxt.$loading.finish()
              // eslint-disable-next-line
              console.error(error)
              EventBus.$emit('snackEvent', {
                color: 'error',
                message: 'Une erreur est survenue',
                active: true,
                close: true
              })
            })
        } else {
          const newPost = new Post(data)
          newPost
            .create()
            .then((response) => {
              this.$nuxt.$loading.finish()
              EventBus.$emit('snackEvent', {
                color: 'success',
                active: true,
                message: 'Le post a été crée avec succès',
                close: true
              })
              this.cancel()
              this.close()
            })
            .catch((error) => {
              this.$nuxt.$loading.finish()
              // eslint-disable-next-line
              console.error(error)
              EventBus.$emit('snackEvent', {
                color: 'error',
                message: 'Une erreur est survenue',
                active: true,
                close: true
              })
            })
        }
      } else {
        this.$nuxt.$loading.finish()
      }
    }
  }
}
</script>
