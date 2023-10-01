"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logger_adapter_1 = require("../logger/logger-adapter");
const graphql_1 = require("@nestjs/graphql");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const gqlCtx = graphql_1.GqlExecutionContext.create(context);
        const now = Date.now();
        const info = gqlCtx.getInfo();
        return next
            .handle()
            .pipe((0, rxjs_1.tap)(() => this.logger.log('Logging Interceptor', `GraphQL operation: ${info.operation.operation} ${info.fieldName} took ${Date.now() - now}ms`)));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_adapter_1.LoggerAdapterToken))
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
