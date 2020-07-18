<template lang="pug">
section
  pre
  v-row
    v-col(cols="12", md="8", v-if="post")
      post-app(:post="post")
    v-col(cols="12", sm="6", md="4", v-if="post && post.creator")
      h3(:class="isEleve(post.type) ? 'eleve--text': 'primary--text'").text-capitalize.font-weight-black créateur
      about-user-app(:user="post.creator").mt-4
  v-row
    v-col(cols="12", sm="4", v-if="!isEleve(post.type) && othersTutors.length")
      h3.text-capitalize.font-weight-black.primary--text.mt-4 tuteurs
      about-user-app(v-for="(tutor, index) in othersTutors", :user="tutor", :key="index").mt-4
    v-col(cols="12", sm="8", v-if="isCreator && post.studentsIds.length")
      h3(v-if="!isEleve(post.type)").text-capitalize.font-weight-black.eleve--text.mt-4 élèves
      v-row
        v-col(cols="12", md="6", v-for="(user, index) in users").pt-0
          about-user-app(:user="user", :key="index").mt-4
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { makeFindMixin } from 'feathers-vuex'

import Post from '@/components/Post/Post'
import AboutUser from '@/components/Post/AboutUser'

export default {
  name: 'PostId',
  components: {
    'post-app': Post,
    'about-user-app': AboutUser
  },
  mixins: [makeFindMixin({ service: 'users', watch: true })],
  asyncData(context) {
    const { store, params, error } = context
    const post = store.getters['posts/get'](params.id)
    if (!post) {
      return store
        .dispatch('posts/get', params.id)
        .then((res) => {
          return { post: res }
        })
        .catch((e) => {
          error({
            statusCode: e.code,
            message: e.message,
            name: e.name,
            errors: e.errors
          })
        })
    } else {
      return { post }
    }
  },
  data() {
    return {
      transition: 'fade-transition',
      limit: 0,
      skip: 0
    }
  },
  computed: {
    ...mapGetters({
      getPost: 'posts/get',
      authUser: 'auth/user'
    }),
    usersQuery() {
      return { _id: { $in: this.post.studentsIds } }
    },
    usersParams() {
      const query = Object.assign({}, this.usersQuery, { $limit: this.limit })
      return {
        query,
        qid: 'users'
      }
    },
    usersQueryWhen() {
      if (this.usersPaginationData.users) {
        const queryString = JSON.stringify(this.usersQuery)
        const queryKeys = Object.keys(this.usersPaginationData.users)
        if (queryKeys.includes(queryString)) {
          const pageIdString = `{"$limit":${this.limit},"$skip":${this.skip}}`
          const pageIdKeys = Object.keys(
            this.usersPaginationData.users[queryString]
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
    title() {
      return this.post?.subject
        ? this.post.subject.name.toUpperCase()
        : 'Chargement...'
    },
    loading() {
      return !this.post
    },
    othersTutors() {
      const creatorId = this.post?.creatorId?.toString()
      return this.post?.tutors?.filter(
        (tutor) => tutor._id.toString() !== creatorId
      )
    },
    isCreator() {
      if (!this.authUser) {
        return false
      }
      return this.authUser?._id?.toString() === this.post?.creatorId?.toString()
    }
  },
  mounted() {
    if (!this.isCreator) {
      this.limit = 0
    } else {
      this.limit = 20
    }
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
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post.comment
        }
      ]
    }
  }
}
</script>
