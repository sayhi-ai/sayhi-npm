import fetch from "isomorphic-fetch";
import Bot from "./bot";
import SERVER_URLS from "./serverUrls";
import Immutable from 'immutable';

let _bots = Immutable.List();

const sayhiAi = {
  init(token) {
    return fetch(SERVER_URLS.GET_BOTS, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({})
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
            .then(json => {
              _bots = Immutable.List(json.bots)
                .map(bot => new Bot(token, bot.id, bot.name, bot.type, bot.description));
              return true;
            })
            .catch(error => {
              throw error;
            });
        }
        throw new Error("Unable to get bots.");
      })
      .catch(error => {
        throw error;
      });
  },

  getBot(name) {
    if (_bots.size === 0) {
      throw new Error("No bots found (yet?).");
    }

    const bot = _bots.filter(bot => bot.getName() === name);

    if (bot.size === 1) {
      return bot.get(0);
    }
    throw new Error("Duplicate bot found.");
  }
};

export default sayhiAi;
