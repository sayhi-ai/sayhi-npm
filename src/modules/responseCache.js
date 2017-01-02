import Immutable from 'immutable'
import logger from "../util/logger"

const PhraseRecord = Immutable.Record({
  type: 'text',
  count: 0,
  responses: Immutable.List()
})

export default class {
  constructor() {
    this._cache = Immutable.Map()
    this._active = true
    this._updateFrequency = 10 // Update cache every 10 reads by default
    this._maxSize = 10
  }

  setActive(active) {
    this._active = active
  }

  setUpdateReadFrequency(updateFrequency) {
    this._updateFrequency = updateFrequency
  }

  setMaxSize(size) {
    this._maxSize = size
  }

  clearCache() {
    this._cache = Immutable.Map()
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
    if (phraseRecord.get('count') > this._updateFrequency) {
      this._cache = this._cache.delete(phrase)
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

    if (!this._active) {
      return immutableResponses
    }

    let phraseRecord = this._cache.get(phrase, null)
    let count = 0
    if (phraseRecord !== null) {
      count = phraseRecord.get('count')
    }

    phraseRecord = new PhraseRecord({
      type: type,
      count: count,
      responses: immutableResponses
    })

    this._cache = this._cache.set(phrase, phraseRecord)
    return immutableResponses
  }
}
