<template lang="pug">
  FeathersVuexFind(:service="service",  :query="internalQuery", :edit-scope="getPaginationInfo", :fetch-query="fetchQuery", :queryWhen="queryWhen", :watch="['query.$skip', 'query.$limit']")
    section(slot-scope="{ items: items, isFindPending }")
      v-data-iterator(:items="items", :items-per-page.sync="itemsPerPage",  :sort-desc="sortDesc", :page="page", hide-default-footer, loading)
        template(v-slot:header)
          v-toolbar(flat)
            v-spacer
            v-toolbar-items
              v-col(cols="12")
                v-select(label="Élements par page", :items="itemsPerPageArray", :menu-props="{bottom: true, offsetY: true}", v-model="itemsPerPage", hide-details, outlined, dense)

        template(v-slot:footer)
          v-pagination(v-model="page", :length="numberOfPages")

        template(v-slot:default="props")
          v-row
            v-col(v-for="(item, indice) in props.items", :key="item.email", cols="12", sm="6", lg="3", align="center", justify="center")
              slot(name="card", :item="item")
                v-card(outlined)
                  v-card-title
                    slot(name="title", :item="item")
                  v-card-subtitle.text-left
                    slot(name="subtitle", :item="item")
                  v-card-text.body-1.text-justify
                    slot(name="text", :item="item")
                      div {{item}}
                  v-card-actions
                    v-spacer
                    v-chip(color="primary", small, @click="editItem(item)", v-if="editable").mr-2
                      v-icon(small) {{svg.mdiPencil}}
                    v-chip(color="red", small, @click="deleteItem(item)", v-if="deletable")
                      v-icon(small) {{svg.mdiDelete}}

        template(v-slot:loading)
          v-row
            v-col(v-for="(item) in numberOfSkeletons", :key="item", cols="12", sm="6", lg="3", align="center", justify="center")
              v-skeleton-loader(type="article, list-item-three-line, actions").text-right


      v-dialog(v-model="dialog", max-width="600px")
        slot(name="edit" :item="editedItem")
</template>

<script>
import { FeathersVuexFind } from 'feathers-vuex'

import {
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPencil,
  mdiDelete
} from '@mdi/js'

export default {
  name: 'IteratorDataTable',
  components: {
    FeathersVuexFind
  },
  props: {
    deletable: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    service: {
      type: String,
      default: null
    },
    modelName: {
      type: String,
      default: null
    },
    itemsPerPageArray: {
      type: Array,
      default: () => [4, 8, 12]
    }
  },
  data() {
    return {
      transition: 'fade-transition',
      svg: {
        mdiChevronDown,
        mdiChevronLeft,
        mdiChevronRight,
        mdiPencil,
        mdiDelete
      },
      ids: [],
      query: {},
      pagination: null,
      total: 0,
      limit: 0,
      skip: 0,
      itemsPerPage: null,
      sortDesc: false,
      page: 1,
      dialog: false,
      editedItem: {}
    }
  },
  computed: {
    numberOfPages() {
      let value = 1
      if (this.itemsPerPage && this.total) {
        value = Math.ceil(this.total / this.itemsPerPage)
      }
      return value
    },
    numberOfSkeletons() {
      return this.itemsPerPage > this.total ? this.total : this.itemsPerPage
    },
    internalQuery() {
      const { idField } = this.$store.state[this.service]
      return {
        [idField]: {
          $in: this.ids
        }
      }
    },
    fetchQuery() {
      return Object.assign({}, this.query, {
        $limit: this.limit,
        $skip: this.skip
      })
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
    itemsPerPage() {
      this.limit = this.itemsPerPage
    }
  },
  created() {
    this.limit = this.itemsPerPageArray[0]
    this.itemsPerPage = this.itemsPerPageArray[0]
  },
  methods: {
    queryWhen() {
      if (this.pagination) {
        const queryString = JSON.stringify(this.query)
        const queryKeys = Object.keys(this.pagination)

        if (queryKeys.includes(queryString)) {
          const pageIdString = `{"$limit":${this.limit},"$skip":${this.skip}}`
          const pageIdKeys = Object.keys(this.pagination[queryString])

          if (pageIdKeys.includes(pageIdString)) {
            const { ids } = this.pagination[queryString][pageIdString]

            this.ids = ids

            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    getPaginationInfo(scope) {
      const { queryInfo, pageInfo, pagination } = scope
      this.pagination = pagination
      this.total = queryInfo.total
      if (this.queryWhen()) {
        if (pageInfo?.ids?.length) {
          this.ids = pageInfo.ids
        }
      }
    },
    deleteItem(item) {
      const Model = this.$FeathersVuex.api[this.modelName]
      const deleteModel = new Model({ id: item._id })
      confirm('Êtes vous sûr de vouloir supprimer ces données ?') &&
        deleteModel.remove()
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    }
  }
}
</script>
