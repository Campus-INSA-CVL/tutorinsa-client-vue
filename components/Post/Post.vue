<template lang="pug">
  v-card(outlined)
    v-card-title #[span.text-uppercase.font-weight-bold {{post.subject.name}}] #[span(v-if="post.startAt").subtitle-2 &nbsp;({{$moment(post.startAt).fromNow()}})]
      v-spacer
      v-tooltip(v-model="tooltip", bottom)
        template(v-slot:activator="{ attrs }")
          v-btn(outlined, @click="share(post)", :small="$vuetify.breakpoint.xs", v-bind="attrs")
            v-icon(v-if="$vuetify.breakpoint.xs") {{svg.mdiShare}}
            span(v-if="!$vuetify.breakpoint.xs") partager
        v-icon(left) {{ svg.mdiClipboardCheck }}
        span.text-capitalize copié
    v-card-text.body-1.pb-0
      div
        v-icon(left) {{ svg.mdiMapMarker }}
        span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold où ?&nbsp;
        span.text-uppercase {{ campus }}

      div(v-if="post.startAt") #[v-icon(left) {{svg.mdiCalendar}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold quand ?] #[span.text-capitalize &nbsp;{{$moment(post.startAt).local().format('dddd LL')}}]

      div(v-if="post.startAt") #[v-icon(left) {{svg.mdiClockOutline}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold à quelle heure ?] #[span &nbsp;{{$moment(post.startAt).local().format('LT')}}-{{$moment(post.endAt).local().format('LT')}}&nbsp;](durée: {{$moment.utc(0).add($moment.duration(post.duration, 'minutes')).format('HH[\']mm["]')}}) #[span(v-if="post.room") en {{post.room.name.toUpperCase()}}]

      div(v-if="post.creator") #[v-icon(left) {{svg.mdiSchool}}] #[span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold par qui ?] {{post.creator.lastName.toUpperCase()}} #[span.text-capitalize {{post.creator.firstName}}]

      div(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").font-weight-medium.title.mt-4 #[span.text-capitalize le]&nbsp;message du créateur:
      div.text-justify.mb-4 {{post.comment}}
      v-divider(v-if="!isEleve(post.type) && user")
      v-row(v-if="!isEleve(post.type) && user")
        v-col(cols="12", sm="6").pb-0
          div Nombre de tuteurs
            v-progress-linear(color="primary", :value="post.tutorsIds.length * 100 / post.tutorsCapacity", height="16", rounded)
              template(v-slot="{ value }")
                span.text-body-2.white--text {{post.tutorsIds.length}}/{{post.tutorsCapacity}}
        v-col(cols="12", sm="6")
          div Nombre d'étudiants
            v-progress-linear(color="eleve", :value="post.studentsIds.length * 100 / post.studentsCapacity", height="16", rounded)
              template(v-slot="{ value }")
                span.text-body-2 {{post.studentsIds.length}}/{{post.studentsCapacity}}
    v-card-actions.pt-0
      v-row(justify="space-between")
        v-col(cols="12", sm="6", align="center", v-if="(isUser('tuteur') && !isEleve(post.type)) || $vuetify.breakpoint.smAndUp")
          v-btn(depressed, color="primary--text",:small="$vuetify.breakpoint.xs", :disabled="!canTutorSubscribe", @click="subscription('tuteur')", v-if="(isUser('tuteur') && !isEleve(post.type))") {{subAsTutor ? 'désinscription' : 'inscription'}} tuteur
        v-col(cols="12", sm="6", align="center", v-if="isUser('eleve') && !isEleve(post.type)")
          v-btn(depressed, color="eleve--text", :small="$vuetify.breakpoint.xs",:disabled="!canStudentSubscribe", @click="subscription('eleve')") {{subAsStudent ? 'désinscription' : 'inscription'}} eleve
</template>

<script>
import { mapGetters } from 'vuex'

import {
  mdiClockOutline,
  mdiCalendar,
  mdiSchool,
  mdiShare,
  mdiClipboardCheck,
  mdiMapMarker
} from '@mdi/js'

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      svg: {
        mdiClockOutline,
        mdiCalendar,
        mdiSchool,
        mdiShare,
        mdiClipboardCheck,
        mdiMapMarker
      },
      tooltip: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    campus() {
      return this.post.campus ?? this.post.room.campus
    },
    subAsStudent() {
      const studentsSubscriptions = this.user?.studentSubscriptionsIds.map(
        (sub) => sub.toString()
      )
      return studentsSubscriptions.includes(this.post._id.toString())
    },
    subAsTutor() {
      const tutorsSubscriptions = this.user?.tutorSubscriptionsIds.map((sub) =>
        sub.toString()
      )
      return tutorsSubscriptions.includes(this.post._id.toString())
    },
    canStudentSubscribe() {
      const postId = this.post._id
      if (this.user.createdPostsIds.includes(postId)) {
        return false
      }
      if (this.subAsStudent) {
        return true
      }
      if (this.post.studentsIds.length === this.post.studentsCapacity) {
        return false
      }
      return true
    },
    canTutorSubscribe() {
      const postId = this.post._id
      if (this.user.createdPostsIds.includes(postId)) {
        return false
      }
      if (this.subAsTutor) {
        return true
      }
      if (this.post.tutorsIds.length === this.post.tutorsCapacity) {
        return false
      }
      return true
    }
  },
  methods: {
    isEleve(type) {
      return type === 'eleve'
    },
    isUser(permission) {
      return this.user?.permissions.includes(permission)
    },
    subscription(as) {
      this.$nuxt.$loading.start()
      const { Subscription } = this.$FeathersVuex.api
      const data = {
        _id: this.post._id.toString(),
        type: '',
        as
      }
      if (as === 'eleve') {
        data.type = this.subAsStudent ? 'unsubscribe' : 'subscribe'
      } else if (as === 'tuteur') {
        data.type = this.subAsTutor ? 'unsubscribe' : 'subscribe'
      }
      const newSub = new Subscription(data)
      newSub
        .patch()
        .then((response) => {
          this.$nuxt.$loading.finish()
          EventBus.$emit('snackEvent', {
            color: 'primary',
            message: `Votre ${
              response.type === 'subscribe' ? 'inscription' : 'désinscription'
            } est bien prise en compte !`,
            active: true,
            close: true
          })
        })
        .catch((e) => {
          // eslint-disable-next-line
          console.error(e)
          this.$nuxt.$loading.finish()
          EventBus.$emit('snackEvent', {
            color: 'error',
            message: e.message,
            active: true,
            close: true
          })
        })
    },
    async share(post) {
      try {
        await navigator.share({
          url: `post/${post._id}`,
          text: `${this.$moment(post.startAt)
            .local()
            .format('[Le] dddd LL [à] LT')}\n\nLe mot du tuteur: ${
            post.comment
          }\n`,
          title: `TutorINSA: ${post.subject?.name.toUpperCase()}`
        })
      } catch (error) {
        try {
          await navigator.clipboard.writeText(window.location.href)
          this.tooltip = true
          setTimeout(() => {
            this.tooltip = false
          }, 1500)
        } catch (error) {
          EventBus.$emit('snackEvent', {
            color: 'error',
            message:
              'Une erreur est survenue lors du chargement de la fonction partager',
            active: true,
            close: true
          })
        }
      }
    }
  }
}
</script>
