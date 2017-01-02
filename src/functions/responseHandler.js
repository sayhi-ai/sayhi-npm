import logger from "../util/logger"

export default class {
  constructor(gcClient, modulesHandler) {
    this._gcClient = gcClient
    this._cache = modulesHandler.getCache()
  }

  getResponse(token, phrase, phraseId, type, vars) {
    logger.debug(`Getting a response for phrase: ${phraseId}..`)
    return this._getResponses(token, phrase, phraseId, type, vars)
      .then(responses => this.chooseResponse(responses))
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

  chooseResponse(responses) {
    if (responses.size > 0) {
      const index = Math.floor(Math.random() * responses.size)
      logger.debug(`Response chosen: ${responses.get(index)} at index ${index}`)
      return responses.get(index)
    }

    logger.warn("No responses found to choose from.")
    return null
  }
}
