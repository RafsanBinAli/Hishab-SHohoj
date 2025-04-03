const { createLogger, format, transports } = require("winston");
const { combine, timestamp, errors, prettyPrint } = format;

const logger = createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true }),
    prettyPrint()
  ),
  defaultMeta: { service: "Backend" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log", level: "info" }),
  ],
});

// Add console transport only if not in production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        timestamp(), 
        prettyPrint() 
      ),
    })
  );
}

module.exports = logger;