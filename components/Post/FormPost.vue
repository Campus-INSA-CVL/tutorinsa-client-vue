<template lang="pug">
  v-dialog(v-model="dialog", fullscreen)
    template(v-slot:activator="{on}")
      v-btn(v-on="on", depressed, :outlined="$vuetify.breakpoint.xs", :x-small="$vuetify.breakpoint.xs", :fab="$vuetify.breakpoint.xs")
        v-icon(:left="$vuetify.breakpoint.smAndUp") {{svg.mdiTextBoxPlusOutline }}
        span(v-if="$vuetify.breakpoint.smAndUp") créer une annonce
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
                      v-radio-group(v-model="editedItem.type", row, :rules="[rules.required]")
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
                              v-text-field(v-on="on", readonly, :prepend-inner-icon="svg.mdiClockOutline", v-model="editedItem.time", outlined, :disabled="!editedItem.roomId", label="Début du tutorat", :color="colorPost", :rules="[rules.required, rules.patternTime]")
                            v-time-picker(v-if="startMenu", allowed-seconds=false, format="24hr", full-width, v-model="editedItem.time",  @click:minute="$refs.startMenu.save(editedItem.time)", :color="colorPost", :min="minStartTimePicker", :max="maxStartTimePicker", :allowed-minutes="allowedMinutes", :allowed-hours="allowedHours")



                        v-col(cols="12", sm="6", v-if="this.editedItem.type === 'tuteur'")
                          v-menu(ref="durationMenu", :close-on-content-click="false", v-model="durationMenu", offset-y,  transition="slide-y-reverse-transition", :return-value.sync="editedItem.duration", top, :nudge-top="10", origin="bottom center")
                            template(v-slot:activator="{on}")
                              v-text-field(v-on="on", readonly, :prepend-inner-icon="svg.mdiClockStart ", v-model="editedItem.duration", outlined, label="Durée du tutorat", :disabled="!editedItem.time", :color="colorPost", :rules="[rules.required, rules.patternTime]")
                            v-time-picker(v-if="durationMenu", allowed-seconds=false, format="24hr", full-width, v-model="editedItem.duration",  @click:minute="$refs.durationMenu.save(editedItem.duration)", :color="colorPost", :max="maxDurationTime", :allowed-minutes="[0, 30]")

                v-card-actions
                  v-row(dense, justify="center")
                    v-col(cols="12", sm="10", md="8", lg="6", align="end")
                      v-btn(text, @click="cancel").mr-4 annuler
                      v-btn(:color="colorPost", depressed, @click="save") créer

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
</template>

<script>
import {
  mdiTextBoxPlusOutline,
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
    try {
      let response = null
      response = await this.findRooms()
      if (!response.data.length) {
        await this.Rooms()
      }
    } catch (error) {
      EventBus.$emit('snackEvent', {
        color: 'error',
        message: 'Une erreur est survenue lors du chargement des salles',
        active: true,
        close: true
      })
    }
  },
  fetchOnServer: false,
  data() {
    return {
      svg: {
        mdiTextBoxPlusOutline,
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
        patternTime: (v) => /\d{2}:(00|30)/g.test(v) || 'Temps invalide',
        min: (v) => v >= 1 || 'Au moins 1',
        maxTutors: (v) => v <= 5 || 'Au maximum 5',
        maxStudents: (v) => v <= 25 || 'Au maximum 20'
      },
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
        type: 'tuteur',
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
        type: 'tuteur',
        roomId: null,
        studentsCapacity: null,
        tutorsCapacity: null
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      findSubjects: 'subjects/find',
      getSubject: 'subjects/get',
      getRoom: 'rooms/get',
      findRooms: 'rooms/find',
      findPosts: 'posts/find',
      findCalendars: 'calendars/find'
    }),
    colorPost() {
      return this.editedItem.type === 'eleve' ? 'eleve' : 'primary'
    },
    formattedDate() {
      return this.editedItem.date
        ? this.$moment(this.editedItem.date).format('dddd DD MMMM YYYY')
        : ''
    },
    filteredRooms() {
      const campus = this.editedItem.campus
      const date = this.editedItem.date
      const day = this.$moment.weekdays(this.$moment(date).day())

      const rooms = this.findRooms({ query: { campus, day } })
      return rooms.data
    },
    minStartTimePicker() {
      const roomId = this.editedItem.roomId
      let min = null
      if (roomId) {
        let room
        try {
          room = this.getRoom(roomId)
        } catch (error) {
          throw new Error(error.message)
        }
        if (room) {
          let date = this.$moment.utc()
          const startAt = this.$moment.utc(room.startAt)
          date.hours(startAt.hours())
          date.minutes(startAt.minutes())
          date = this.$moment(date.format()).format('HH[:]mm')
          min = date
        } else {
          return null
        }
      }
      return min
    },
    maxStartTimePicker() {
      const roomId = this.editedItem.roomId
      let max = null
      if (roomId) {
        let room
        try {
          room = this.getRoom(roomId)
        } catch (error) {
          throw new Error(error.message)
        }
        if (room) {
          let date = this.$moment.utc()
          const endAt = this.$moment.utc(room.endAt)
          date.hours(endAt.hours())
          date.minutes(endAt.minutes())
          date = this.$moment(date.format())
            .subtract(30, 'minutes')
            .format('HH[:]mm')
          max = date
        } else {
          return null
        }
      }
      return max
    },
    maxDurationTime() {
      const roomId = this.editedItem.roomId
      let room = null
      try {
        room = this.getRoom(roomId)
      } catch (error) {
        throw new Error(error.message)
      }
      let duration = '00:00'
      let calendars = null
      if (room) {
        const afterDate = this.$moment
          .utc(this.editedItem.date)
          .add(1, 'day')
          .format()
        const date = this.$moment.utc(this.editedItem.date).format()

        calendars = this.findCalendars({
          query: { roomId, startAt: { $gte: date, $lte: afterDate } }
        })

        let numberPreviousSlot = 0
        if (calendars.data[0] && calendars.data[0].slots) {
          calendars.data[0].slots.forEach((slot) => {
            const startAtSlot = this.$moment(slot.startAt)
            const diff = startAtSlot.diff(this.dateTimeTutorat)
            if (diff < 0) {
              numberPreviousSlot++
            }
          })
        }
        duration = this.$moment
          .utc(0)
          .add(room.duration, 'minutes')
          .subtract(30 * numberPreviousSlot, 'minutes')
          .format('HH[:]mm')
        if (calendars.data[0] && calendars.data[0].slots) {
          let found = false
          calendars.data[0].slots.forEach((slot) => {
            const startAtSlot = this.$moment(slot.startAt)
            const diff = startAtSlot.diff(this.dateTimeTutorat)
            if (diff > 0 && !found) {
              found = true
              duration = this.$moment.utc(diff).format('HH[:]mm')
            }
          })
        }
      }
      return duration
    },
    dateTimeTutorat() {
      const date = this.$moment(this.editedItem.date)
      const time = this.$moment(this.editedItem.time, 'LT')
      date.hours(time.hours())
      date.minutes(time.minutes())
      return date
    },
    futurePosts() {
      let posts = null
      if (this.editedItem.type === 'tuteur') {
        const date = this.$moment.utc(this.editedItem.date).format()
        const afterDate = this.$moment
          .utc(this.editedItem.date)
          .add(1, 'day')
          .format()
        const calendars = this.findCalendars({
          query: { startAt: { $gte: date, $lte: afterDate } }
        })
        const postsId = []
        calendars.data.forEach((calendar) => {
          const slots = calendar.slots
          if (slots) {
            slots.forEach((slot) => {
              if (!postsId.includes(slot.postId)) {
                postsId.push(slot.postId)
              }
            })
          }
        })
        posts = this.findPosts({
          query: { _id: { $in: postsId }, type: this.editedItem.type }
        }).data
      } else if (this.editedItem.type === 'eleve') {
        posts = this.findPosts({
          query: {
            'subject._id': this.editedItem.subjectId,
            $sort: {
              date: 1
            }
          }
        }).data
      }

      return posts
    }
  },
  watch: {
    dialog(value) {
      if (value) {
        window.addEventListener('keydown', this.handleKeys)
      }
    },
    'editedItem.type'(type) {
      this.cancel()
      this.editedItem.type = type
    },
    '$route.path'() {
      this.close()
    },
    async 'editedItem.date'(a) {
      let calendars = null

      if (a) {
        const afterDate = this.$moment
          .utc(this.editedItem.date)
          .add(1, 'day')
          .format()
        const date = this.$moment.utc(this.editedItem.date).format()
        try {
          calendars = await this.findCalendars({
            query: { startAt: { $gte: date, $lte: afterDate } }
          })
          if (!calendars.data.length) {
            await this.Calendars({
              query: { startAt: { $gte: date, $lte: afterDate } }
            })
          }
        } catch (error) {
          throw new Error(error.message)
        }
      }
    },
    async 'editedItem.roomId'(roomId) {
      let calendars = null
      if (roomId) {
        // Find all calendars to know which slot is available
        const afterDate = this.$moment
          .utc(this.editedItem.date)
          .add(1, 'day')
          .format()
        const date = this.$moment.utc(this.editedItem.date).format()
        try {
          calendars = await this.findCalendars({
            query: { roomId, startAt: { $gte: date, $lte: afterDate } }
          })
          if (!calendars.data.length) {
            calendars = await this.Calendars({
              query: { roomId, startAt: { $gte: date, $lte: afterDate } }
            })
          }
        } catch (error) {
          throw new Error(error.message)
        }
        let room = null
        // Set time from startAt of the room
        try {
          room = this.getRoom(roomId)
        } catch (error) {
          throw new Error(error.message)
        }
        if (room) {
          let date = this.$moment.utc()
          const startAt = this.$moment.utc(room.startAt)
          if (calendars.data[0] && calendars.data[0].slots) {
            calendars.data[0].slots.forEach((slot) => {
              const obj = Object.assign({}, slot)
              const startAtSlot = this.$moment.utc(obj.startAt)
              if (
                startAt.hours() === startAtSlot.hours() &&
                startAt.minutes() === startAtSlot.minutes()
              ) {
                startAt.add(30, 'minutes')
              }
            })
          }
          date.hours(startAt.hours())
          date.minutes(startAt.minutes())
          date = this.$moment(date.format()).format('HH[:]mm')
          this.editedItem.time = date
          this.editedItem.duration = this.maxDurationTime
        }
      } else {
        this.editedItem.time = null
        this.editedItem.duration = null
      }
    }
  },
  methods: {
    ...mapActions({
      Subjects: 'subjects/find',
      Rooms: 'rooms/find',
      Calendars: 'calendars/find'
    }),
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
    allowedMinutes(m) {
      const allowed = [0, 30]
      if (allowed.includes(m)) {
        let available = true

        const date = this.$moment.utc(this.editedItem.date).format()
        const calendars = this.findCalendars({
          query: { roomId: this.editedItem.roomId, startAt: { $gte: date } }
        })
        if (calendars.data.length === 0) {
          return true
        }

        const wantedTime = this.editedItem.time
        const wantedHours = this.$moment(wantedTime, 'LT').hours()

        if (calendars.data[0].slots) {
          calendars.data[0].slots.forEach((slot) => {
            const obj = Object.assign({}, slot)
            const startAtSlot = this.$moment(obj.startAt)
            const hours = startAtSlot.hours()
            const minutes = startAtSlot.minutes()

            if (hours === wantedHours && minutes === m) {
              available = false
            }
          })
        } else {
          return true
        }
        return available
      }
      return false
    },
    allowedHours(h) {
      let available = true

      const date = this.$moment.utc(this.editedItem.date).format()
      const calendars = this.findCalendars({
        query: { roomId: this.editedItem.roomId, startAt: { $gte: date } }
      })
      if (calendars.data.length === 0) {
        return true
      }
      if (calendars.data[0].slots) {
        const date = calendars.data[0].date
        let viewTimes = 0
        calendars.data[0].slots.forEach((slot) => {
          const obj = Object.assign({}, slot)
          const startAtSlot = this.$moment(obj.startAt)
          const hours = startAtSlot.hours()
          if (hours === h) {
            if (startAtSlot.isSame(date)) {
              available = false
            }
            viewTimes++
          }
          // same with endAt
        })
        if (viewTimes === 2) {
          available = false
        }
      } else {
        return true
      }
      return available
    },
    cancel() {
      Object.assign(this.editedItem, this.resetItem)
      this.$refs.FormPost.reset()
    },
    close() {
      window.removeEventListener('keydown', this.handleKeys)
      this.dialog = false
    },
    save() {
      this.$nuxt.$loading.start()
      if (this.$refs.FormPost.validate()) {
        const date = this.$moment.utc(this.editedItem.date)
        const timeDate = this.$moment.utc(
          this.$moment(this.editedItem.time, 'LT').format()
        )
        date.hours(timeDate.hours())
        date.minutes(timeDate.minutes())

        let duration = this.$moment.utc(0)
        const timeDuration = this.$moment.utc(
          this.$moment.utc(this.editedItem.duration, 'LT').format()
        )
        duration = timeDuration.minutes() + timeDuration.hours() * 60

        const { Post } = this.$FeathersVuex.api
        const data = Object.assign({}, this.editedItem)
        data.studentsCapacity = Number(data.studentsCapacity)
        data.tutorsCapacity = Number(data.tutorsCapacity)
        data.duration = duration
        data.startAt = date.format()
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
      } else {
        this.$nuxt.$loading.finish()
      }
    }
  }
}
</script>
