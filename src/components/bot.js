import ENV_VARS from "../../tools/ENV_VARS"

const ESCAPE_REGEX = /\\./g

export default class Bot {
  constructor(functionHandler, modulesHandler, token, id, name) {
    this._phraseHandler = functionHandler.getPhraseHandler()
    this._responseHandler = functionHandler.getResponseHandler()
    this._token = token
    this._id = id
    this._name = name
    this._cache = modulesHandler.getCache()
  }

  getId() {
    return this._id
  }

  getName() {
    return this._name
  }

  say(phrase, vars = null) {
    return Promise.resolve().then(() => this._getResponse(this._token, phrase, ENV_VARS.CONSTANTS.TEXT_RESPONSE, vars))
  }

  sayHTML(phrase, vars = null) {
    return Promise.resolve().then(() => this._getResponse(this._token, phrase, ENV_VARS.CONSTANTS.HTML_RESPONSE, vars))
  }

  _getResponse(token, phrase, type, vars) {
    if (token === null || this._id === null) {
      return null
    }

    // Get keys from vars
    let keys = ["{}"]
    if (vars !== null) {
      keys = Object.keys(vars)
    }

    // Check if phrase is cached
    const cachedResponses = this._cache.checkCache(phrase, keys, type)
    if (cachedResponses !== null) {
      let response = this._responseHandler.chooseResponse(phrase, cachedResponses)
      return this._replaceVars(response, "", vars)
    }

    return this._phraseHandler.getPhraseId(token, this._id, phrase)
      .then(id => this._responseHandler.getResponse(this._token, phrase, id, type, keys))
      .then(response => this._replaceVars(response, "", vars))
      .catch(error => {
        throw error
      })
  }

  _replaceVars(text, result, vars) {
    if (text === null || vars === null) {
      return text
    }

    let matchArr
    const varRegex = /({\w+})+/g  // Needs to reset every time so we define it here

    if ((matchArr = varRegex.exec(text)) !== null) {
      const start = matchArr.index
      let prefix = this._removeEscapeCharacters(text.substr(0, start))
      let variable = this._removeEscapeCharacters(text.substr(start, matchArr[0].length))
      const remainder = text.substr(start + matchArr[0].length)

      if (this._isEscaped(text, start - 1, 0)) {
        prefix = prefix.substr(0, prefix.length - 1)
      } else {
        variable = variable.substr(1)
        variable = variable.substr(0, variable.length - 1)
        variable = vars[variable]
      }
      return this._replaceVars(remainder, result + prefix + variable, vars)
    }

    text = this._removeEscapeCharacters(text)
    result += text
    return result
  }

  _removeEscapeCharacters(text) {
    let matchArr = ESCAPE_REGEX.exec(text)
    while (matchArr !== null) {
      const start = matchArr.index
      text = text.slice(0, start) + text.slice(start + 1)

      matchArr = ESCAPE_REGEX.exec(text)
    }
    return text
  }

  _isEscaped(text, index, count) {
    if (index < 0 || text[index] !== ENV_VARS.CONSTANTS.ESCAPE) {
      return count % 2 !== 0
    }
    return this._isEscaped(text, index - 1, count + 1)
  }
}
