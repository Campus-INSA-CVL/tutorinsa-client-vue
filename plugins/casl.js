/* import { decode as decodeJWT } from 'jsonwebtoken'
import { AbilityBuilder } from '@casl/ability'
import { unpackRules } from '@casl/ability/extra'
import { abilitiesPlugin } from '@casl/vue'
import Vue from 'vue'

const ability = AbilityBuilder.define((can) => {})

export default function({ app }) {
  const { store } = app

  console.log('reAuth')

  store
    .dispatch('auth/authenticate')
    .then((response) => {
      console.log(response)
      const payload = decodeJWT(response.accessToken)
      ability.update(unpackRules(payload.rules))
    })
    .catch((error) => {
      if (!error.message.includes('Could not find stored JWT')) {
        console.error(error)
      }
    })
}

console.log(ability)

Vue.use(abilitiesPlugin, ability)
 */

import Vue from 'vue'
import { abilitiesPlugin } from '@casl/vue'
import { ability } from '@/plugins/ability.js'

Vue.use(abilitiesPlugin, ability)
