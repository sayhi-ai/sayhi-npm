import Cache from "./responseCache"

export default class {
  constructor() {
    this._cache = new Cache()
  }

  getCache() {
    return this._cache
  }
}
