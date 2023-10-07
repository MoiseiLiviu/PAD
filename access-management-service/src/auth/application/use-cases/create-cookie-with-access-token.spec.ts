import {CreateCookieWithAccessTokenUseCase} from "./create-cookie-with-access-token.usecase";
import {JWTConfigPort} from "../ports/output/jwt-config.port";
import {JWTPort} from "../ports/output/jwt.port";
import {LoggerPort} from "@pad_lab/common";


describe('CreateCookieWithAccessTokenUseCase', () => {
    let useCase: CreateCookieWithAccessTokenUseCase;
    let mockJwtConfigService: jest.Mocked<JWTConfigPort>;
    let mockJwtService: jest.Mocked<JWTPort>;
    let mockLogger: jest.Mocked<LoggerPort>;

    beforeEach(() => {
        mockJwtConfigService = {
            getJwtSecret: jest.fn(),
            getJwtExpirationTime: jest.fn(),
            getJwtRefreshSecret: jest.fn(),
            getJwtRefreshExpirationTime: jest.fn(),
        };
        mockJwtService = {
            createToken: jest.fn(),
            checkToken: jest.fn(),
        };
        mockLogger = {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            verbose: jest.fn(),
        };

        useCase = new CreateCookieWithAccessTokenUseCase(
            mockJwtConfigService,
            mockJwtService,
            mockLogger,
        );
    });

    it('should generate a cookie with access token for given email', async () => {
        const email = 'test@email.com';
        const mockSecret = 'secret';
        const mockExpiresIn = '3600';
        const mockToken = 'mockToken';

        mockJwtConfigService.getJwtSecret.mockReturnValue(mockSecret);
        mockJwtConfigService.getJwtExpirationTime.mockReturnValue(mockExpiresIn);
        mockJwtService.createToken.mockReturnValue(mockToken);

        const result = await useCase.execute(email);

        expect(mockJwtConfigService.getJwtSecret).toHaveBeenCalled();
        expect(mockJwtConfigService.getJwtExpirationTime).toHaveBeenCalled();
        expect(mockJwtService.createToken).toHaveBeenCalledWith({ email }, mockSecret, mockExpiresIn);
        expect(mockLogger.log).toHaveBeenCalledWith(
            'CreateCookieWithAccessTokenUseCase execute',
            `Cookie with access token generated for user with email ${email}.`,
        );
        expect(result).toBe(`Authentication=${mockToken}; HttpOnly; Path=/; Max-Age=${mockExpiresIn}`);
    });
});
