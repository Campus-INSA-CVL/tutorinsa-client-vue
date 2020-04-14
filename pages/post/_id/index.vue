<template lang="pug">
  v-card(outlined, v-if="post")
    v-card-title
      span.text-uppercase.font-weight-bold {{post.subject.name}}
      span.subtitle-2 &nbsp;({{$moment(post.date).fromNow()}})
    v-card-text.body-1
      v-icon(left) {{svg.mdiCalendar}}
      span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold quand ?
      span.text-capitalize &nbsp;{{$moment(post.date).local().format('dddd LL')}}
      br
      v-icon(left) {{svg.mdiClockOutline}}
      span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold où ?
      span  &nbsp;{{$moment(post.date).local().format('LT')}}-{{$moment(post.endAt).local().format('LT')}}&nbsp;(durée: {{$moment(post.duration).utc().format('HH[\']mm["]')}}) #[span(v-if="post.room") en {{post.room.name}} à {{post.room.campus.toUpperCase()}}]
      br
      v-icon(left, v-if="post.creator") {{svg.mdiAccountEdit}}
      span(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-uppercase.font-weight-bold par qui ?
      span(v-if="post.creator")  &nbsp;{{post.creator.firstName}}
      p
        div(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").title #[span.text-capitalize le]&nbsp;message du tuteur:
        div.text-justify {{post.comment}}
    v-card-actions
      v-spacer
      v-btn(outlined) partager
      v-btn(depressed, :color="isEleve(post.type) ? 'eleve': 'primary'") s'inscrire
    p {{post}}
</template>

<script>
import { mdiClockOutline, mdiCalendar, mdiAccountEdit } from '@mdi/js'
import { mapGetters, mapActions } from 'vuex'

export default {
  async fetch() {
    try {
      let response = await this.getPost(this.$route.params.id)
      if (response === null) {
        response = await this.fetchPost(this.$route.params.id)
      }
      this.post = response
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  },
  fetchOnServer: false,
  data() {
    return {
      post: undefined,
      svg: {
        mdiClockOutline,
        mdiCalendar,
        mdiAccountEdit
      }
    }
  },
  computed: {
    ...mapGetters({
      getPost: 'posts/get'
    })
  },
  methods: {
    ...mapActions({
      fetchPost: 'posts/get'
    }),
    isEleve(type) {
      return type === 'eleve'
    }
  },
  head() {
    return {
      title:
        this.post && this.post.subject
          ? this.post.subject.name.toUpperCase()
          : 'Chargement...'
    }
  }
}
</script>
