<template lang="pug">
  v-hover(v-slot:default="{ hover }")
    v-card(:class="!outlined && isEleve(post.type) ? 'student': (outlined ? '' : 'tutor')", :elevation="hoverProp && hover ? 12 : (hoverProp ? 4 : 0)", :outlined="outlined")

      v-card-title
        span.text-uppercase.font-weight-bold.text-truncate {{post.subject.name}}
        span(v-if="post.startAt").subtitle-2 &nbsp;({{$moment(post.startAt).fromNow()}})

      v-card-subtitle.text-left
        v-icon(small, left) {{ svg.mdiMapMarker }}
        span.text-uppercase {{ campus }}
        br
        v-icon(small, left, v-if="post.startAt") {{svg.mdiCalendar}}
        span(v-if="post.startAt").text-capitalize &nbsp;{{$moment(post.startAt).local().format('dddd LL')}}
        br(v-if="post.startAt")
        v-icon(small, left, v-if="post.endAt") {{svg.mdiClockOutline}}
        span(v-if="post.endAt") {{$moment(post.startAt).local().format('LT')}}-{{$moment(post.endAt).local().format('LT')}}&nbsp;({{$moment.utc(0).add($moment.duration(post.duration, 'minutes')).format('HH[:]mm')}})
        br(v-if="post.endAt")
        v-icon(small, left, v-if="post.creator") {{svg.mdiSchool}}
        span(v-if="post.creator")  #[span.text-uppercase {{post.creator.lastName}}] #[span.text-capitalize {{post.creator.firstName}}]

      v-card-text.text-justify.body-1.text-truncate {{post.comment}}

      v-card-actions
        v-btn(v-if="deletable && isCreator", outlined, @click="deletePost").red--text supprimer
        v-spacer
        v-btn(depressed, outlined, @click="share(post)", v-if="shareBtn") partager
        v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'", nuxt, :to="`/post/${post._id}`") voir plus
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiClockOutline, mdiCalendar, mdiSchool, mdiMapMarker } from '@mdi/js'

import { EventBus } from '@/utils/event-bus'

export default {
  name: 'PreviewPost',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    },
    hoverProp: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    shareBtn: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      svg: {
        mdiClockOutline,
        mdiCalendar,
        mdiSchool,
        mdiMapMarker
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    isCreator() {
      return this.post?.creator?._id === this.user?._id
    },
    isAdmin() {
      return this.user?.permissions?.includes('admin')
    },
    campus() {
      return this.post.campus ?? this.post.room.campus
    }
  },
  methods: {
    isEleve(type) {
      return type === 'eleve'
    },
    deletePost() {
      const Model = this.$FeathersVuex.api.Post
      const deleteModel = new Model({ id: this.post._id })
      confirm(
        'Êtes vous sûr de vouloir supprimer cette annonce ? 😥 Cette action est irréversible !'
      ) && deleteModel.remove()
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
          title: `TutorINSA: ${post.subject.name.toUpperCase()}`
        })
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
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
</script>
