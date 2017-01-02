import ENV_VARS from "../../tools/ENV_VARS"

export default class Bot {
  constructor(functionHandler, modulesHandler, token, id, name, type, description) {
    this._phraseHandler = functionHandler.getPhraseHandler()
    this._responseHandler = functionHandler.getResponseHandler()
    this._token = token
    this._id = id
    this._name = name
    this._type = type
    this._description = description
    this._cache = modulesHandler.getCache()
  }

  getId() {
    return this._id
  }

  getName() {
    return this._name
  }

  getType() {
    return this._type
  }

  getDescription() {
    return this._description
  }

  say(phrase, vars = null) {
    return this._getResponse(this._token, phrase, ENV_VARS.CONSTANTS.TEXT_RESPONSE, vars)
  }

  sayHTML(phrase, vars = null) {
    return this._getResponse(this._token, phrase, ENV_VARS.CONSTANTS.HTML_RESPONSE, vars)
  }

  _getResponse(token, phrase, type, vars) {
    if (token === null || this._id === null) {
      return null
    }

    // Check if phrase is cached
    const cachedResponses = this._cache.checkCache(phrase, type)
    if (cachedResponses !== null) {
      let response = this._responseHandler.chooseResponse(cachedResponses)
      return this._replaceVars(response, vars)
    }

    // Otherwise fetch responses from server
    let keys = ["{}"]
    if (vars !== null) {
      keys = Object.keys(vars)
    }

    return this._phraseHandler.getPhraseId(token, this._id, phrase)
      .then(id => this._responseHandler.getResponse(this._token, phrase, id, type, keys))
      .then(response => this._replaceVars(response, vars))
      .catch(error => {
        throw error
      })
  }

  _replaceVars(response, vars) {
    if (response === null || vars === null) {
      return response
    }

    const keys = Object.keys(vars)
    keys.forEach(key => {
      const regex = new RegExp('{' + key + '}', "g")

      response = response.replace(regex, vars[key])
    })

    return response
  }
}
