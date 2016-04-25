fs = require 'fs'
yaml = require 'js-yaml'
Hapi = require 'hapi'
Path = require 'path'
util = require 'util'

class BUXMockServer
  constructor: (@mockDir, @port=7878) ->

  start: (callback) ->
    if !@mockDir then throw Error 'specify @mockDir'

    workingPath = Path.resolve __dirname, @mockDir
    config = yaml.load(fs.readFileSync(Path.join(workingPath, 'endpoints.yaml')))

    loadMock = (method, fn) ->
      realFn = Path.join(workingPath, 'endpoints', method.toLowerCase() + '_' + fn.replace(/\//g,'_') + '.json')
      #console.log "Loading: #{realFn}"
      return JSON.parse(fs.readFileSync(realFn))

    server = new Hapi.Server()
    server.connection { port: @port }

    createHandler = (method, endpoint, endpointData, methodData) ->
      return (req, reply) ->
        #console.log "Hit endpoint: #{method} #{endpoint}"

        mock = loadMock method, endpoint
        reply(mock.json)

    for endpoint, endpointData of config.endpoints
      endpointPath = endpoint.replace(/(@[a-z]+)/gi,(x)->'{'+x.substring(1)+'}')
      pureUrl = (endpoint.substring(0,1) == '/')
      if pureUrl
        path = util.format '/%s', endpointPath.substring(1)
      else
        path = util.format '/%s/%s', config.appBaseUrl, endpointPath

      #console.log "Loading endpoint: #{endpoint}, path = #{path}"
      fn = endpoint.replace('/', '_')

      methods = []
      for m in [ 'GET', 'POST', 'PUT', 'DELETE' ]
        if endpointData[m] then methods.push m
      if methods.length == 0 then methods.push 'GET'

      for method in methods
        server.route
          method: method
          path: path
          handler: createHandler(method, endpoint, endpointData, endpointData[method])

    server.start (err) ->
      if err then throw Error err
      callback(server)

module.exports = BUXMockServer

