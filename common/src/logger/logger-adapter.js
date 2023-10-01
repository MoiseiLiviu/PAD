"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerAdapter = exports.LoggerAdapterToken = void 0;
const common_1 = require("@nestjs/common");
exports.LoggerAdapterToken = 'LoggerAdapterToken';
let LoggerAdapter = class LoggerAdapter extends common_1.Logger {
    debug(context, message) {
        if (process.env.NODE_ENV !== 'production') {
            super.debug(`[DEBUG] ${message}`, context);
        }
    }
    error(context, message, trace) {
        super.debug(`[ERROR] ${message}`, context);
    }
    log(context, message) {
        super.log(`[INFO] ${message}`, context);
    }
    verbose(context, message) {
        if (process.env.NODE_ENV !== 'production') {
            super.verbose(`[VERBOSE] ${message}`, context);
        }
    }
    warn(context, message) {
        super.warn(`[WARN] ${message}`, context);
    }
};
LoggerAdapter = __decorate([
    (0, common_1.Injectable)()
], LoggerAdapter);
exports.LoggerAdapter = LoggerAdapter;
