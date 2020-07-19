import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { iff, discard } from 'feathers-hooks-common'
import feathersVuex, { initAuth } from 'feathers-vuex'

const socket = io('https://tutorinsa-server.azurewebsites.net', {
  transports: ['websocket']
})

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          (context) => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        )
      ]
    }
  })

export default feathersClient

// Setting up feathers-vuex
const {
  makeServicePlugin,
  makeAuthPlugin,
  BaseModel,
  models,
  FeathersVuex
} = feathersVuex(feathersClient, {
  serverAlias: 'api',
  idField: '_id', // Must match the id field in your database table/collection
  whitelist: ['$regex', '$options'],
  enableEvents: process.client // No events for SSR server
})

export {
  makeAuthPlugin,
  makeServicePlugin,
  initAuth,
  BaseModel,
  models,
  FeathersVuex
}
