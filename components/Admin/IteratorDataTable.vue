<template lang="pug">
  FeathersVuexFind(:service="service", :query="{}", watch="query")
    section(slot-scope="{ items: items }")
      v-data-iterator(:items="items", :items-per-page.sync="itemsPerPage",  :sort-desc="sortDesc", :page="page", hide-default-footer)
        template(v-slot:footer)
          v-row(align="center", justify="center").mt-2
            span.grey--text #[span.text-capitalize éléments] par page
            v-menu(offset-y)
              template(v-slot:activator="{on}")
                v-btn(text, v-on="on").ml-2.primary--text
                  span {{itemsPerPage}}
                  v-icon {{svg.mdiChevronDown}}
              v-list
                v-list-item(v-for="(number, index) in itemsPerPageArray", :key="index", @click="updateItemsPerPage(number)")
                  v-list-item-title {{number}}
            v-spacer
            span.mr-4.grey--text page {{page}} sur {{numberOfPages}}
            v-btn(fab, small, @click="formerPage", :disabled="page === 1", depressed).mr-1.primary
              v-icon {{svg.mdiChevronLeft}}
            v-btn(fab, small, @click="nextPage", :disabled="page === numberOfPages", depressed).ml-1.primary
              v-icon {{svg.mdiChevronRight}}

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
    numberOfItems: {
      type: Number,
      default: null
    },
    service: {
      type: String,
      default: null
    },
    modelName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      svg: {
        mdiChevronDown,
        mdiChevronLeft,
        mdiChevronRight,
        mdiPencil,
        mdiDelete
      },
      itemsPerPage: 4,
      sortDesc: false,
      page: 1,
      itemsPerPageArray: [4, 8, 12],
      dialog: false,
      editedItem: {}
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.numberOfItems / this.itemsPerPage)
    }
  },
  methods: {
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
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
