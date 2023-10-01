import {LoggerPort} from "./logger.port";
import {Injectable, Scope} from '@nestjs/common';
import winston, {Logger} from 'winston';
import {LogstashTransport} from 'winston-logstash-transport';

require('dotenv').config();

@Injectable({scope: Scope.TRANSIENT})
export class WinstonLoggerAdapter implements LoggerPort {
    private readonly logger: Logger;

    constructor() {
        logger: winston.createLogger({
            format: winston.format.json(),
            transports: [
                new LogstashTransport({
                    host: process.env.LOGSTASH_URL,
                    port: process.env.LOGSTASH_PORT,
                }),
                new winston.transports.Console({
                    format: winston.format.simple(),
                }),
            ],
        })
    }

    debug(context: string, message: string): void {
        this.logger.debug(`${context} : ${message}`);
    }

    log(context: string, message: string): void {
        this.logger.debug(`${context} : ${message}`);
    }

    error(context: string, message: string, trace?: string): void {
        this.logger.error(`${context} : ${message}. Trace: ${trace}`);
    }

    warn(context: string, message: string): void {
        this.logger.debug(`${context} : ${message}`);
    }

    verbose(context: string, message: string): void {
        this.logger.verbose(`${context} : ${message}`);
    }
}