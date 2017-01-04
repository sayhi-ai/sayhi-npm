import ENV_VARS from "../../tools/ENV_VARS"
import Lokka from "lokka"
import HttpTransport from "lokka-transport-http"

export default class {
  query(query) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + query.token
    }
    const client = new Lokka({
      transport: new HttpTransport(ENV_VARS.CONSTANTS.GRAPHCOOL_URL, {headers})
    })

    return client.query(query.query)
      .then(response => {
        if (response !== undefined) {
          return response
        }
        throw new Error("GraphCool query returned undefined.")
      })
      .catch(error => {
        throw new Error(`Error with graph GQ query. -- ${JSON.stringify(error)}`)
      })
  }
}
