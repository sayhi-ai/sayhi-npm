import Bot from "./components/bot"
import Immutable from "immutable"
import GCClient from "./clients/graphcoolClient"
import FunctionHandler from "./functions/functionHandler"
import ModulesHandler from "./modules/modulesHandler"
import PreProcessor from "./util/preProcessor"

const _gcClient = new GCClient()
const _modulesHandler = new ModulesHandler()
const _functionHandler = new FunctionHandler(_gcClient, _modulesHandler)
let _bots = Immutable.List()

const sayhiAi = {
  init(token) {
    return _functionHandler.getBotHandler().getBots(token)
      .then(bots => {
        _bots = Immutable.List(bots)
          .map(bot => new Bot(_functionHandler, _modulesHandler, token, bot.id, bot.name, bot.type, bot.description))
        return true
      })
      .catch(error => {
        throw error
      })
  },

  getCache() {
    return _modulesHandler.getCache()
  },

  getBot(name) {
    name = PreProcessor.safeEscape(name)

    if (_bots.size === 0) {
      throw new Error("No bots found (yet?).")
    }

    const bot = _bots.filter(bot => bot.getName() === name)

    if (bot.size === 1) {
      return bot.get(0)
    }
    throw new Error("Duplicate bot found.")
  }
}

export default sayhiAi
