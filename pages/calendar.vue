<template lang="pug">
  section
    v-toolbar(flat)
      v-btn(icon, @click="prev").primary.mr-5.ml-0
        v-icon {{ svg.mdiChevronLeft }}
      v-btn(icon, @click="next").primary
        v-icon {{ svg.mdiChevronRight }}
      v-spacer
      v-toolbar-title.text-capitalize {{ $moment(month).format('MMMM') }}
      v-spacer
      v-col(cols="5", sm="3", lg="1").pr-0
        v-select(label="Présentation", :items="typeSelect", :menu-props="{bottom: true, offsetY: true}", v-model="type", hide-details, outlined, dense)
    v-row
      v-col
        v-sheet(height="600")
          v-calendar(ref="calendar", v-model="focus", :weekdays="weekdays", color="primary", :locale="lang", :events="events", :type="type", @click:event="showEvent", short-intervals, :first-interval="intervals.first", :interval-minutes="intervals.minutes", :interval-count="intervals.count", :interval-height="intervals.height", @click:more="viewDay", @click:date="viewDay")
          v-menu(v-model="selectedOpen", :close-on-content-click="false", :activator="selectedElement", offset-x)
            preview-post-app(:post="selectedEvent.post")
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'Calendar',
  components: {
    'preview-post-app': PreviewPost
  },
  mixins: [makeFindMixin({ service: 'posts', watch: true })],
  data() {
    return {
      svg: {
        mdiChevronLeft,
        mdiChevronRight
      },
      weekdays: [1, 2, 3, 4, 5],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      focus: '',
      lang: 'fr',
      type: 'month',
      limit: 50,
      skip: 0,
      intervals: {
        first: 15,
        minutes: 30,
        count: 31,
        heigth: 48
      },
      typeSelect: [
        { text: 'jour', value: 'day' },
        { text: 'semaine', value: 'week' },
        { text: 'mois', value: 'month' },
        { text: '4 jours', value: '4day' }
      ]
    }
  },
  computed: {
    postsQueryWhen() {
      if (this.postsPaginationData.posts) {
        const queryString = JSON.stringify(this.query)
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
    month() {
      return this.focus ? this.focus : new Date()
    },
    query() {
      return {
        startAt: {
          $gte: this.$moment.utc(this.month).startOf('month'),
          $lte: this.$moment.utc(this.month).endOf('month')
        },
        type: 'tuteur'
      }
    },
    postsParams() {
      const query = {
        $limit: this.limit,
        $skip: this.skip
      }
      Object.assign(query, this.query)
      return {
        query,
        pagination: true,
        qid: 'posts'
      }
    },
    events() {
      if (this.posts) {
        const events = []
        this.posts.forEach((post) => {
          events.push({
            start: new Date(post.startAt),
            end: new Date(post.endAt),
            name: post.subject.name,
            post,
            timed: true
          })
        })
        return events
      }
      return []
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeys)
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('keydown', this.handleKeys)
    next()
  },
  methods: {
    handleKeys(e) {
      switch (e.keyCode) {
        case 37:
          this.prev()
          break
        case 39:
          this.next()
          break
        case 32:
          e.preventDefault()
          this.setToday()
          break
        default:
          break
      }
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    }
  },
  head() {
    return {
      title: 'Calendrier'
    }
  }
}
</script>
