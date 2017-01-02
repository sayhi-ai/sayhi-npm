import Immutable from 'immutable'
import ENV_VARS from "../../tools/ENV_VARS"
import logger from "../util/logger"

const PhraseRecord = Immutable.Record({
  type: "text",
  count: 0,
  responses: Immutable.List(),
  history: Immutable.List()
})

export default class {
  constructor() {
    this._cache = Immutable.OrderedMap()
    this._active = true
    this._updateInterval = 1800000  // 30 min by default
    this._maxSize = 1000            // Total number of elements allowed in the cache
    this._batchDeleteSize = 100     // Remove 100 entries from the cashe at a time if it is full
    this._size = 0

    // Start remote update cache loop
    this._remoteUpdateCache(this)
  }

  setActive(active) {
    this._active = active
  }

  setUpdateFrequency(updateFrequency) {
    this._updateInterval = updateFrequency
  }

  setMaxSize(size) {
    this._maxSize = size
  }

  clearCache() {
    this._cache = Immutable.OrderedMap()
  }

  checkCache(phrase, type) {
    if (!this._active) {
      return null
    }

    logger.debug(`Checking cache for phrase: ${phrase}`)
    let phraseRecord = this._cache.get(phrase, null)
    if (phraseRecord === null) {
      logger.debug(`No cached response found for phrase: ${phrase}`)
      return null
    }

    const responses = phraseRecord.get('responses')
    if (responses === null || phraseRecord.get('type') !== type) {
      logger.debug(`No cached response found for phrase: ${phrase}`)
      return null
    }

    phraseRecord = phraseRecord.set('count', phraseRecord.get('count') + 1)
    this._cache = this._cache.set(phrase, phraseRecord)

    logger.debug(`Found cached response for phrase: ${phrase}`)
    return responses
  }

  updateCache(responses, phrase, type) {
    if (responses === null) {
      return null
    }

    const immutableResponses = Immutable.List(responses)
        .map(response => this._chooseResponseFromType(response, type))

    if (!this._active) {
      return immutableResponses
    }

    // Remove first 10 elements of cache if the cashe is full
    if (this._size > this._maxSize) {
      const phrases = this._cache.keySeq()

      for (let i = 0; i <= this._batchDeleteSize; i++) {
        this._deleteFromCache(phrases.get(i))
      }
    }

    let phraseRecord = this._cache.get(phrase, null)
    let count = 0
    let oldResponseSize = 0
    if (phraseRecord !== null) {
      count = phraseRecord.get('count')
      oldResponseSize = phraseRecord.get('responses').size
    }

    this._size += immutableResponses.size - oldResponseSize + 3

    phraseRecord = new PhraseRecord({
      type: type,
      count: count,
      responses: immutableResponses
    })

    this._cache = this._cache.set(phrase, phraseRecord)
    return immutableResponses
  }

  _deleteFromCache(phrase) {
    const phraseRecord = this._cache.get(phrase, null)
    this._size -= phraseRecord.get('responses').size + 3
    this._cache = this._cache.delete(phrase)
  }

  _remoteUpdateCache(context) {
    logger.info("Updating cache from remote..")
    context.clearCache()
    logger.info("Updated cache.")
    setTimeout(() => context._remoteUpdateCache(context), this._updateInterval)
  }

  _chooseResponseFromType(response, type) {
    if (response === null) {
      return null
    }

    switch (type) {
      case ENV_VARS.CONSTANTS.TEXT_RESPONSE:
        return response.text
      case ENV_VARS.CONSTANTS.HTML_RESPONSE:
        return response.html
      default:
        return null
    }
  }
}