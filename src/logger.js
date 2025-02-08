// @ts-check


export class Logger {

    /* ANSI Escape Codes */
    static #ANSI_BLUE = '\x1b[34m'
    static #ANSI_GREEN = '\x1b[32m';
    static #ANSI_YELLOW = '\x1b[33m';
    static #ANSI_RED_BOLD = '\x1b[1;31m';
    static #ANSI_RESET = '\x1b[39m\x1b[22m';

    static debugEnabled = false

    /**
     * Prints the message as Debug to the stdout
     *
     * @param {string} message - Message, that should be logged
     */
    static debug(message) {
        if (!this.debugEnabled)
            return

        console.log(
            `${this.#ANSI_BLUE}[DEBUG][${new Date().toLocaleString()}] ${message}${this.#ANSI_RESET}`
        )
    }

    /**
     * Prints the message as Success to the stdout
     *
     * @param {string} message - Message, that should be logged
     */
    static success(message) {
        console.log(
            `${this.#ANSI_GREEN}[SUCCESS][${new Date().toLocaleString()}] ${message}${this.#ANSI_RESET}`
        ) 
    }

    /**
     * Prints the message as Info to the stdout
     *
     * @param {string} message - Message, that should be logged 
     */
    static info(message) {
        console.log(
            `[INFO][${new Date().toLocaleString()}] ${message}${this.#ANSI_RESET}`
        ) 
    }

    /**
     * Prints the message as Warning to the stdout
     *
     * @param {string} message - Message, that should be logged
     */
    static warning(message) {
        console.log(
            `${this.#ANSI_YELLOW}[WARNING][${new Date().toLocaleString()}] ${message}${this.#ANSI_RESET}`
        ) 
    }

    /**
     * Printd the message as Error to the stdout
     *
     * @param {string} message - Message, that should be logged 
     */
    static error(message) {
        console.log(
            `${this.#ANSI_RED_BOLD}[ERROR][${new Date().toLocaleString()}}] ${message}${this.#ANSI_RESET}`
        ) 
    }

}
