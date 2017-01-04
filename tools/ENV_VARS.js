let ENV_VARS

const CONSTANTS = {
  GRAPHCOOL_URL: "https://api.graph.cool/simple/v1/citcyox3z0pbh0171u6i6b8nu",
  VARIABLE_START: "{",
  VARIABLE_END: "}",
  ESCAPE: "\\",
  TEXT_RESPONSE: 'text',
  HTML_RESPONSE: 'html'
}

if (process.env.NODE_ENV === "production") {
  ENV_VARS = {
    SERVER_URL: "https://api.sayhi.ai",
    CONSTANTS: CONSTANTS
  }
} else {
  ENV_VARS = {
    SERVER_URL: "http://localhost:8080",
    CONSTANTS: CONSTANTS
  }
}

export default ENV_VARS
