<template lang="pug">
  v-row(justify="start")
    v-col(cols="12", md="6", lg="4").pt-0
      user-app(:user="user")
    v-col(cols="12", md="6", lg="8", v-if="user").pt-0
      h2.text-capitalize.mb-2.primary--text mes postes
      iterator-table-app(serviceName="posts", :itemsPerPageArray="[12, 24, 36]", :query="queryCreatedPosts", largeCard)
        template(v-slot:card="{ item }")
          preview-post-app(:post="item", outlined, deletable)
    v-col(cols="12", md="6", v-if="user").pt-0
      h2.text-capitalize.mb-2.eleve--text mes abonnements élèves
      iterator-table-app(serviceName="posts", :itemsPerPageArray="[12, 24, 36]", :query="queryStudentSubscriptions", largeCard)
        template(v-slot:card="{ item }")
          preview-post-app(:post="item", outlined, deletable)
    v-col(cols="12", md="6", v-if="user").pt-0
      h2.text-capitalize.mb-2.primary--text mes abonnements tuteurs
      iterator-table-app(serviceName="posts", :itemsPerPageArray="[12, 24, 36]", :query="queryTutorSubscriptions", largeCard)
        template(v-slot:card="{ item }")
          preview-post-app(:post="item", outlined, deletable)
</template>

<script>
import { mapGetters } from 'vuex'

import User from '@/components/User/User'
import IteratorDataTable from '@/components/Tables/IteratorDataTable'
import PreviewPost from '@/components/Post/PreviewPost'

export default {
  name: 'Profile',
  components: {
    'user-app': User,
    'iterator-table-app': IteratorDataTable,
    'preview-post-app': PreviewPost
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    queryCreatedPosts() {
      return {
        _id: {
          $in: this.user.createdPostsIds
        }
      }
    },
    queryStudentSubscriptions() {
      return {
        _id: {
          $in: this.user.studentSubscriptionsIds
        }
      }
    },
    queryTutorSubscriptions() {
      return {
        _id: {
          $in: this.user.tutorSubscriptionsIds
        }
      }
    }
  },
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  head() {
    return {
      title: 'Profile'
    }
  }
}
</script>

<style></style>
