<template lang="pug">
  FeathersVuexFind(:service="service",  :query="internalQuery", :edit-scope="getPaginationInfo", :fetch-query="fetchQuery")
    section(slot-scope="{ items: items, isFindPending}")
      v-data-iterator(:items="items", :items-per-page.sync="itemsPerPage",  :sort-desc="sortDesc", :page="page", hide-default-footer, loading)

        template(v-slot:header="{ pagination, options}")
          v-toolbar(flat)
            div {{fetchQuery}}
            v-spacer
            v-col(cols="2")
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
              v-skeleton-loader(type="article, actions")


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
      total: 0,
      limit: 10,
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
      console.log(idField)
      return {
        [idField]: {
          $in: this.ids
        }
      }
    },
    fetchQuery() {
      console.debug(this.total)
      return Object.assign({}, this.query, {
        $limit: this.limit,
        $skip: this.skip
      })
    }
  },
  mounted() {
    this.itemsPerPage = this.itemsPerPageArray[0]
  },
  methods: {
    getPaginationInfo(scope) {
      const { queryInfo, pageInfo } = scope
      console.log(scope)
      this.total = queryInfo.total
      if (pageInfo && pageInfo.ids) {
        this.ids = pageInfo.ids
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
