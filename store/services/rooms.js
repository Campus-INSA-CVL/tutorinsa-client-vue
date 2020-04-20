/* eslint-disable no-useless-constructor */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../plugins/feathers-client'

class Room extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Room'
  // Define default properties here
  static instanceDefaults() {
    return {
      name: ''
    }
  }
}
const servicePath = 'rooms'
const servicePlugin = makeServicePlugin({
  Model: Room,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
