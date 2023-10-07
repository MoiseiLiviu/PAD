
import { UserRepository } from '../../../user/domain/core/repositories/user-repository.interface';
import {CreateCookieWithRefreshTokenUseCase} from "./create-cookie-with-refresh-token";
import {JWTConfigPort} from "../ports/output/jwt-config.port";
import {JWTPort} from "../ports/output/jwt.port";
import {LoggerPort} from "@pad_lab/common";
import {BcryptPort} from "../ports/output/bcrypt.port";

describe('CreateCookieWithRefreshTokenUseCase', () => {
    let useCase: CreateCookieWithRefreshTokenUseCase;
    let mockJwtConfigService: jest.Mocked<JWTConfigPort>;
    let mockJwtService: jest.Mocked<JWTPort>;
    let mockLogger: jest.Mocked<LoggerPort>;
    let mockBcryptService: jest.Mocked<BcryptPort>;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockJwtConfigService = {
            getJwtRefreshSecret: jest.fn(),
            getJwtRefreshExpirationTime: jest.fn(),
            getJwtSecret: jest.fn(),
            getJwtExpirationTime: jest.fn(),
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
        mockBcryptService = {
            hash: jest.fn(),
            compare: jest.fn(),
        };
        mockUserRepository = {
            updateRefreshToken: jest.fn(),
            getUserByEmail: jest.fn(),
            updateLastLogin: jest.fn(),
            save: jest.fn(),
            getById: jest.fn(),
        };

        useCase = new CreateCookieWithRefreshTokenUseCase(
            mockLogger,
            mockJwtConfigService,
            mockJwtService,
            mockUserRepository,
            mockBcryptService,
        );
    });

    it('should generate a cookie with refresh token for given email', async () => {
        const email = 'test@email.com';
        const mockSecret = 'refreshSecret';
        const mockExpiresIn = '7200';
        const mockToken = 'mockRefreshToken';
        const mockHashedToken = 'hashedMockToken';

        mockJwtConfigService.getJwtRefreshSecret.mockReturnValue(mockSecret);
        mockJwtConfigService.getJwtRefreshExpirationTime.mockReturnValue(mockExpiresIn);
        mockJwtService.createToken.mockReturnValue(mockToken);
        mockBcryptService.hash.mockReturnValue(Promise.resolve(mockHashedToken));

        const result = await useCase.createCookieWithRefreshToken(email);

        expect(mockJwtConfigService.getJwtRefreshSecret).toHaveBeenCalled();
        expect(mockJwtConfigService.getJwtRefreshExpirationTime).toHaveBeenCalled();
        expect(mockJwtService.createToken).toHaveBeenCalledWith({ email }, mockSecret, mockExpiresIn);
        expect(mockBcryptService.hash).toHaveBeenCalledWith(mockToken);
        expect(mockUserRepository.updateRefreshToken).toHaveBeenCalledWith(email, mockHashedToken);
        expect(mockLogger.log).toHaveBeenCalledWith(
            'CreateCookieWithRefreshTokenUseCase execute',
            `Cookie with refresh token generated for user with email ${email}.`,
        );
        expect(result).toBe(`Refresh=${mockToken}; HttpOnly; Path=/; Max-Age=${mockExpiresIn}`);
    });
});
