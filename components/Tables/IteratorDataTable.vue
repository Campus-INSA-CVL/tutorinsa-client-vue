<template lang="pug">
v-data-iterator(:items="items", :items-per-page.sync="itemsPerPage", :page="page", hide-default-footer, :loading="isFindServicePending", :sort-by.sync='sortBy')
  template(v-slot:header)
    v-toolbar(flat)
      v-spacer
      v-toolbar-items
        v-col(cols="6")
          v-select(label="Type de posts", :items="typeSelect", :menu-props="{bottom: true, offsetY: true}", v-model="type", hide-details, outlined, dense, v-if="serviceName === 'posts'")
        v-col(cols="6")
          v-select(label="Élements par page", :items="itemsPerPageArray", :menu-props="{bottom: true, offsetY: true}", v-model="itemsPerPage", hide-details, outlined, dense)
  template(v-slot:footer)
    v-pagination(v-model="page", :length="numberOfPages", v-if="items.length")
  template(v-slot:no-data)
    v-row
      v-col.text-center
        h3.font-weight-bold Nous n'avons rien trouvé ! 🤷‍♂️
  template(v-slot:loading)
    v-row
      v-col(v-for="item in itemsPerPage", :key="item", cols="12", :sm="largeCard ? '12' : '6'", lg="4", align="center", justify="center")
        v-skeleton-loader(type="article, actions").text-right
  template(v-slot:default="{ items }")
    v-row
      v-col(v-for="item in items", :key="item._id", cols="12", :sm="largeCard ? '12' : '6'", lg="4", align="center", justify="center")
        slot(name="card", :item="item")
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'

export default {
  name: 'IteratorDataTable',
  mixins: [
    makeFindMixin({
      service() {
        return this.serviceName
      },
      watch: true
    })
  ],
  props: {
    serviceName: {
      type: String,
      default: ''
    },
    largeCard: {
      type: Boolean,
      default: false
    },
    itemsPerPageArray: {
      type: Array,
      default: () => [4, 8, 12]
    },
    query: {
      type: Object,
      default: () => {}
    },
    sortBy: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      page: 1,
      limit: null,
      skip: 0,
      type: null,
      typeSelect: [
        {
          text: 'Tous',
          value: null
        },
        {
          text: 'Élève',
          value: 'eleve'
        },
        {
          text: 'Tuteur',
          value: 'tuteur'
        }
      ],
      itemsPerPage: null,
      total: null
    }
  },
  computed: {
    fullQuery() {
      const query = Object.assign({}, this.query)
      if (this.type) {
        query.type = this.type
      }
      return query
    },
    numberOfPages() {
      let total = 1
      if (
        this.servicePaginationData &&
        this.servicePaginationData[this.serviceName] &&
        this.servicePaginationData[this.serviceName][
          JSON.stringify(this.fullQuery)
        ]
      ) {
        total =
          this.total ??
          this.servicePaginationData[this.serviceName][
            JSON.stringify(this.fullQuery)
          ].total
      }
      let value = 1
      if (this.itemsPerPage && total) {
        value = Math.ceil(total / this.itemsPerPage)
      }
      return value
    },
    serviceParams() {
      const query = {
        $limit: this.limit,
        $skip: this.skip
      }
      Object.assign(query, this.fullQuery)
      const qid = this.serviceName
      return {
        query,
        pagination: true,
        qid
      }
    },
    serviceQueryWhen() {
      if (this.servicePaginationData[this.serviceName]) {
        const queryString = JSON.stringify(this.fullQuery)
        const queryKeys = Object.keys(
          this.servicePaginationData[this.serviceName]
        )
        if (queryKeys.includes(queryString)) {
          const pageIdString = `{"$limit":${this.limit ??
            this.itemsPerPageArray[0]},"$skip":${this.skip}}`
          const pageIdKeys = Object.keys(
            this.servicePaginationData[this.serviceName][queryString]
          )
          if (pageIdKeys.includes(pageIdString)) {
            return false
          }
        }
        return true
      } else {
        return true
      }
    }
  },
  watch: {
    page(value) {
      this.$vuetify.goTo(0, {
        duration: 600,
        easing: 'easeInOutCubic'
      })
      this.skip = this.itemsPerPage * (value - 1)
    },
    itemsPerPage(value) {
      this.limit = value
    },
    type() {
      this.findService()
      this.page = 1
      if (
        this.servicePaginationData &&
        this.servicePaginationData[this.serviceName] &&
        this.servicePaginationData[this.serviceName][
          JSON.stringify(this.fullQuery)
        ]
      ) {
        this.total =
          this.servicePaginationData[this.serviceName][
            JSON.stringify(this.fullQuery)
          ].total ?? 1
      }
    }
  },
  created() {
    this.limit = this.itemsPerPageArray[0]
    this.itemsPerPage = this.itemsPerPageArray[0]
  },
  methods: {
    previousPage() {
      this.skip = this.skip - this.limit
    },
    nextPage() {
      this.skip = this.skip + this.limit
    }
  }
}
</script>
