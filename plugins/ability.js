import { AbilityBuilder } from '@casl/ability'
// import { unpackRules } from '@casl/ability/extra'
// import { decode as decodeJWT } from 'jsonwebtoken'

export const ability = AbilityBuilder.define((can) => {})

export default async function({ store }, inject) {
  try {
    /* const response =  */ await store.dispatch('auth/authenticate')
    // const payload = decodeJWT(response.accessToken)
    // ability.update(unpackRules(payload.rules))
  } catch (error) {
    console.error(error)
  }
}
