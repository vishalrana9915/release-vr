import winston from "winston";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

// Function to colorize level text based on the log level
const colorizeLevel = (level) => {
  switch (level) {
    case "info":
      return `${colors.blue}${level.toUpperCase()}${colors.reset}`;
    case "warn":
      return `${colors.yellow}${level.toUpperCase()}${colors.reset}`;
    case "error":
      return `${colors.red}${level.toUpperCase()}${colors.reset}`;
    default:
      return level.toUpperCase();
  }
};

// Custom format for Winston logger
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const coloredLevel = colorizeLevel(level);
  return `${timestamp} ${coloredLevel}: ${message}`;
});

// Create the logger with Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
