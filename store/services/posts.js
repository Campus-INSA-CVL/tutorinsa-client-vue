/* eslint-disable no-useless-constructor */
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../plugins/feathers-client'

class Post extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Post'
  // Define default properties here
  static instanceDefaults() {
    return {
      comment: '',
      campus: '',
      subjectId: '',
      studentsIds: [],
      tutorsIds: [],
      type: '',
      startAt: '',
      duration: 0,
      roomId: '',
      studentsCapacity: 0,
      tutorsCapacity: 0
    }
  }
}
const servicePath = 'posts'
const servicePlugin = makeServicePlugin({
  Model: Post,
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
