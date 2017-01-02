import logger from "../util/logger"

export default class {
  constructor(gcClient, modulesHandler) {
    this._gcClient = gcClient
    this._cache = modulesHandler.getCache()
  }

  getResponse(token, phrase, phraseId, type, vars) {
    logger.debug(`Getting a response for phrase: ${phraseId}..`)
    return this._getResponses(token, phrase, phraseId, type, vars)
      .then(responses => this.chooseResponse(phrase, responses))
      .catch(error => {
        throw error
      })
  }

  _getResponses(token, phrase, phraseId, type, vars) {
    const query = {
      query: `
          query {
            Phrase(id: "${phraseId}") {
              responses(filter: {
                vars: ${JSON.stringify(vars)}
              }) {
                id,
                ${type}
              }
            }
          }`,
      token: token
    }

    return this._gcClient.query(query)
      .then(response => {
        logger.debug(`Got responses for phrase: ${phraseId}.`)
        return this._cache.updateCache(response.Phrase.responses, phrase, type)
      })
      .catch(error => {
        throw new Error(`Unable to get responses for phrase: ${phraseId}. -- ${JSON.stringify(error)}`)
      })
  }

  chooseResponse(phrase, responses) {
    if (responses.size > 0) {
      const history = this._cache.getResponseHistory(phrase)
      const index = this._generateIndex(history, responses.size)
      this._cache.addToResponseHistory(phrase, index)
      logger.debug(`Response chosen: ${responses.get(index)} at index ${index}`)
      return responses.get(index)
    }

    logger.warn("No responses found to choose from.")
    return null
  }

  _generateIndex(history, size) {
    const index = Math.floor(Math.random() * size)
    let lastIndex = null
    let secondToLastIndex = null
    if (history.size > 1) {
      lastIndex = history[history.size - 1]
      secondToLastIndex = history[history.size - 2]
    } else if (history.size > 0) {
      lastIndex = history[history.size - 1]
    }

    if (index === lastIndex || index === secondToLastIndex || (history.size <= size - 2 && history.contains(index))) {
      return this._generateIndex(history, size)
    }
    return index
  }
}
