/* eslint-disable no-useless-constructor */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../plugins/feathers-client'

class Calendar extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Calendar'
  // Define default properties here
  static instanceDefaults() {
    return {
      date: '',
      roomId: '',
      slots: []
    }
  }
}
const servicePath = 'calendar'
const servicePlugin = makeServicePlugin({
  Model: Calendar,
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