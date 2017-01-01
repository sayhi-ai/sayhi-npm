import fetch from "isomorphic-fetch";
import SERVER_URLS from "./serverUrls";

const RESPONSE_TYPE = {
  TEXT: "TEXT",
  HTML: "HTML"
};

export default class Bot {
  constructor(token, id, name, type, description) {
    this._token = token;
    this._id = id;
    this._name = name;
    this._type = type;
    this._description = description;
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }

  getType() {
    return this._type;
  }

  getDescription() {
    return this._description;
  }

  say(phrase, vars = null) {
    return this._getResponse(this._token, phrase, RESPONSE_TYPE.TEXT, vars);
  }

  sayHTML(phrase, vars = null) {
    return this._getResponse(this._token, phrase, RESPONSE_TYPE.HTML, vars);
  }

  _getResponse(token, phrase, type, vars) {
    let url = this._chooseURLFromType(type);

    if (token === null || this._id === null) {
      return null;
    }

    let keys = ["{}"];
    if (vars !== null) {
      keys = Object.keys(vars);
    }

    return this._getPhraseId(token, phrase)
      .then(id => {
        if (id === null) {
          return null;
        }

        return fetch(url, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            phraseId: id,
            vars: keys
          })
        });
      })
      .then(response => {
        if (response !== null && response.status === 200) {
          return response.json()
            .then(json => this._chooseResponseFromType(type, json.response))
            .then(response => this._replaceVars(response, vars))
            .catch(error => {
              throw error;
            });
        }
        return null;
      })
      .catch(error => {
        throw error;
      });
  }

  _getPhraseId(token, phrase) {
    return fetch(SERVER_URLS.GET_PHRASE_ID, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        botId: this._id,
        phrase: phrase
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
            .then(json => json.id)
            .catch(error => {
              throw error;
            });
        }
        return null;
      })
      .catch(error => {
        throw error;
      });
  }

  _chooseURLFromType(type) {
    switch (type) {
      case RESPONSE_TYPE.TEXT:
        return SERVER_URLS.GET_RESPONSE_PLAIN;
      case RESPONSE_TYPE.HTML:
        return SERVER_URLS.GET_RESPONSE_HTML;
      default:
        return SERVER_URLS.GET_RESPONSE_PLAIN;
    }
  }

  _chooseResponseFromType(type, response) {
    if (response === null) {
      return null;
    }

    switch (type) {
      case RESPONSE_TYPE.TEXT:
        return response.text;
      case RESPONSE_TYPE.HTML:
        return response.html;
      default:
        return null;
    }
  }

  _replaceVars(response, vars) {
    if (response === null && vars === null) {
      return null;
    }

    const keys = Object.keys(vars);
    keys.forEach(key => {
      const regex = new RegExp('{' + key + '}', "g");

      response = response.replace(regex, vars[key]);
    });

    return response;
  }
}
