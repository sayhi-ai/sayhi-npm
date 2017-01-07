import jwtDecode from "jwt-decode"
import logger from "../util/logger"

export default class {
  constructor(gcClient, modulesHandler) {
    this._gcClient = gcClient
  }

  getBots(token) {
    const decodedToken = jwtDecode(token)
    logger.debug(`Getting all bots for user: ${decodedToken.userId}..`)

    const query = {
      query: `
        query getBots($id: ID!){
          User(id: $id) {
            bots {
              id,
              name
            }
          }
        }`,
      vars: {
        id: decodedToken.userId
      },
      token: token
    }

    return this._gcClient.query(query)
      .then(response => {
        const bots = response.User.bots
        logger.debug(`Got all bots for user: ${decodedToken.userId} .`)
        return bots
      })
      .catch(error => {
        throw new Error(`Error getting bots for user: ${decodedToken.userId}. -- ${JSON.stringify(error)}`)
      })
  }
}
