import { Injectable, Logger } from '@nestjs/common';
import { LoggerPort } from './logger.port';


@Injectable()
export class LoggerAdapter extends Logger implements LoggerPort {
  debug(context: string, message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }

  error(context: string, message: string, trace?: string): void {
    super.debug(`[ERROR] ${message}`, context);
  }

  log(context: string, message: string): void {
    super.log(`[INFO] ${message}`, context);
  }

  verbose(context: string, message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }

  warn(context: string, message: string): void {
    super.warn(`[WARN] ${message}`, context);
  }
}
