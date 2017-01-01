import ENV_VARS from "../tools/ENV_VARS";

const SERVER_URL = ENV_VARS.SERVER_URL;

export default {
  LOGIN: SERVER_URL + '/login',
  GET_BOTS: SERVER_URL + '/bot/all',
  GET_PHRASE_ID: SERVER_URL + '/phrase/get',
  GET_RESPONSE_PLAIN: SERVER_URL + '/response/getplain',
  GET_RESPONSE_HTML: SERVER_URL + '/response/gethtml'
};
