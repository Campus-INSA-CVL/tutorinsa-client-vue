<template lang="pug">
  v-row
    v-col(cols="12")
      v-toolbar(short, flat)
        v-toolbar-title #[span.text-capitalize portail] administrateur
        template(v-slot:extension)
          v-tabs(grow, show-arrows)
            v-tabs-slider(color="primary")
            v-tab(v-for="(item, index) in tabs", :key="index", :to="item.link", nuxt, exact) {{item.name}}
    v-col(cols="12")
      v-container(fluid)
        nuxt-child
</template>

<script>
export default {
  name: 'Admin',
  middleware: 'admin',
  data() {
    return {
      tabs: [
        { name: 'home', link: '/admin' },
        { name: 'users', link: '/admin/users' },
        { name: 'posts', link: '/admin/posts' },
        { name: 'matières', link: '/admin/subjects' },
        { name: 'années', link: '/admin/years' },
        { name: 'départements', link: '/admin/departments' },
        { name: 'salles', link: '/admin/rooms' },
        { name: 'calendrier', link: '/admin/calendar' }
      ]
    }
  },

  head() {
    return {
      title: 'Admin'
    }
  }
}
</script>
