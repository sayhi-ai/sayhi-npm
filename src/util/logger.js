import winston from 'winston'

let logger = null

if (process.env.NODE_ENV !== "production") {
  winston.emitErrs = true

  const transports = [
    new winston.transports.Console({
      level: 'debug',
      json: false,
      colorize: true
    })
  ]

  logger = new winston.Logger({
    transports: transports,
    exitOnError: false
  })

  winston.handleExceptions(transports)
} else {
  logger = {
    debug(text) {
    },
    info(text) {
    },
    warn(text) {
    },
    error(text) {
    },
    fatal(text) {
    }
  }
}

export default logger
