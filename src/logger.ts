/**
 * ANSI-Escape colors used for log formatting.
 * The colors are applied to different log levels to make them visually distinct.
 */
export enum Color {
  BLUE = "\x1b[34m",
  YELLOW = "\x1b[33m",
  RED = "\x1b[31m",
  DEFAULT = "\x1b[39m",
}

/**
 * Logger is a singleton class that provides logging functionality with different levels
 * of severity (debug, info, warning, error). It uses ANSI escape codes for colorized output.
 * The log levels can be toggled for debugging purposes.
 */
export class Logger {
  /** The instance of the Logger (singleton pattern) */
  private static instance: Logger;

  /** A flag indicating whether debug logging is enabled */
  private isDebug: boolean = false;

  /**
   * Logs a message at the debug level. This log is colorized in blue.
   * Logs only when the `isDebug` flag is enabled.
   *
   * @param {string} message - The message to be logged.
   */
  public debug(message: string): void {
    if (this.isDebug) this.log("DEBUG", Color.BLUE, message);
  }

  /**
   * Logs a message at the info level. This log is displayed in the default color.
   *
   * @param {string} message - The message to be logged.
   */
  public info(message: string): void {
    this.log("INFO", Color.DEFAULT, message);
  }

  /**
   * Logs a message at the warning level. This log is colorized in yellow.
   *
   * @param {string} message - The message to be logged.
   */
  public warning(message: string): void {
    this.log("WARNING", Color.YELLOW, message);
  }

  /**
   * Logs a message at the error level. This log is colorized in red.
   *
   * @param {string} message - The message to be logged.
   */
  public error(message: string): void {
    this.log("ERROR", Color.RED, message);
  }

  /**
   * The main log function used to format and output messages to the console.
   * This function prepends a log header with the log level and timestamp to the message.
   *
   * @param {string} name - The name of the log level (e.g., "DEBUG", "INFO").
   * @param {Color} color - The color to apply to the log level (ANSI escape code).
   * @param {string} message - The message to be logged.
   */
  public log(name: string, color: Color, message: string): void {
    const logHeader: string = `[${color + name + Color.DEFAULT}][${this.genTimestamp()}]`;

    console.log(`${logHeader} ${message}`);
  }

  /**
   * Sets the Debug flag and works as follows:
   * - true: Enables all Debug statements
   * - false: Disables all Debug statements
   *
   * @param {boolean} debug - The Debug Flag
   */
  public setDebug(debug: boolean) {
    this.isDebug = debug;
  }

  /**
   * Generates a timestamp in the format "day/month/year hour:minute:second".
   * Used to prepend the log header with the current timestamp.
   *
   * @returns {string} - The current timestamp in the format "day/month/year hour:minute:second".
   */
  private genTimestamp(): string {
    const currentDate: Date = new Date();
    const date: string = `${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;
    const time: string = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    return `${date} ${time}`;
  }

  /**
   * Returns the singleton instance of the Logger class.
   * If the instance does not exist, it creates a new one.
   *
   * @returns {Logger} - The singleton instance of the Logger class.
   */
  public static getInstance(): Logger {
    if (this.instance == undefined) this.instance = new Logger();

    return this.instance;
  }
}
