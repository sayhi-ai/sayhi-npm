import winston from 'winston'
winston.emitErrs = true

const transports = [
  new winston.transports.Console({
    level: 'debug',
    json: false,
    colorize: true
  })
]

const logger = new winston.Logger({
  transports: transports,
  exitOnError: false
})

winston.handleExceptions(transports)

export default logger
