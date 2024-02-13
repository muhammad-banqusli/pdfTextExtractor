const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 