import fetch from "isomorphic-fetch";
import ENV_VARS from "../tools/ENV_VARS";

const sayhi_ai = {
    login(email, password) {
        return fetch(ENV_VARS.SERVER_URL + "/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
    },

    say(token, phrase, persona) {
      return this.say(token, phrase, persona, true, [])
    },

    say(token, phrase, persona, personal) {
        return fetch(ENV_VARS.SERVER_URL + "/getresponse", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": token,
                "phrase": phrase,
                "persona": persona,
                "personal": personal
            })
        })
    },

    replaceVars(response, vars) {
        for (let i = 0; i < vars.length; i++) {
            response = response.replace(
                ENV_VARS.CONSTANTS.RESPONSE_VARIABLE + i, vars[i]);
        }
    },

    addResponse(token, phrase, persona, response) {
        return fetch(ENV_VARS.SERVER_URL + "/addresponse", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": token,
                "phrase": phrase,
                "persona": persona,
                "response": response
            })
        })
    },

    removeResponse(token, response) {
        return fetch(ENV_VARS.SERVER_URL + "/removeresponse", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": token,
                "response": response
            })
        })
    }
};

export default sayhi_ai
