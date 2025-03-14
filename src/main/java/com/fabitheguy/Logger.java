package com.fabitheguy;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Singleton Logger class to log messages with different severity levels.
 * Supports INFO, WARNING, and ERROR messages with colored console output.
 */
public class Logger {

    private static Logger instance;
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("dd/MM/yy HH:mm:ss");

    /**
     * Logs an informational message.
     *
     * @param message the message to be logged
     */
    public void info(String message) {
        final String COLOR_WHITE = "\033[37m";

        log("INFO", COLOR_WHITE, message);
    }

    /**
     * Logs a warning message.
     *
     * @param message the message to be logged
     */
    public void warning(String message) {
        final String COLOR_YELLOW = "\033[33m";

        log("WARNING", COLOR_YELLOW, message);
    }

    /**
     * Logs an error message.
     *
     * @param message the message to be logged
     */
    public void error(String message) {
        final String COLOR_RED = "\033[31m";

        log("ERROR", COLOR_RED, message);
    }

    /**
     * Logs a message with a given type and color formatting.
     *
     * @param type    the log level (INFO, WARNING, ERROR)
     * @param color   the ANSI color code for formatting
     * @param message the message to be logged
     */
    private void log(String type, String color, String message) {
        final String COLOR_RESET = "\033[0m";
        final String fullMessage = String.format("%s[%s][%s] %s%s", color, type, generateTimeStamp(), message, COLOR_RESET);

        System.out.println(fullMessage);
    }

    /**
     * Generates a formatted timestamp for log messages.
     *
     * @return the formatted timestamp string
     */
    private String generateTimeStamp() {
        return LocalDateTime.now().format(timeFormatter);
    }

    /**
     * Returns the singleton instance of the Logger class.
     * Ensures thread-safe instantiation.
     *
     * @return the singleton Logger instance
     */
    public static synchronized Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }

        return instance;
    }

}
