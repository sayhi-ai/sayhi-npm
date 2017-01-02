import BotHandler from "./botHandler"
import PhraseHandler from "./phraseHandler"
import ResponseHandler from "./responseHandler"

export default class {
  constructor(gcClient, modulesHandler) {
    this._botHandler = new BotHandler(gcClient, modulesHandler)
    this._phraseHandler = new PhraseHandler(gcClient, modulesHandler)
    this._responseHandler = new ResponseHandler(gcClient, modulesHandler)
  }

  getBotHandler() {
    return this._botHandler
  }

  getPhraseHandler() {
    return this._phraseHandler
  }

  getResponseHandler() {
    return this._responseHandler
  }
}
