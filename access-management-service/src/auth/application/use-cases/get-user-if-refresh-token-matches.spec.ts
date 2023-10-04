import {GetUserIfRefreshTokenMatchesUseCase} from './get-user-if-refresh-token-matches.usecase';
import {UserRepository} from '../../../user/domain/core/repositories/user-repository.interface';
import {BcryptPort} from "../ports/output/bcrypt.port";
import {LoggerPort} from "@nest-upskilling/common/dist";

describe('GetUserIfRefreshTokenMatchesUseCase', () => {
    let useCase: GetUserIfRefreshTokenMatchesUseCase;
    let mockBcryptService: jest.Mocked<BcryptPort>;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockLogger: jest.Mocked<LoggerPort>;

    beforeEach(() => {
        mockBcryptService = {
            compare: jest.fn(),
            hash: jest.fn(),
        };
        mockUserRepository = {
            getUserByEmail: jest.fn(),
            updateRefreshToken: jest.fn(),
            updateLastLogin: jest.fn(),
            save: jest.fn(),
            getById: jest.fn(),
        };
        mockLogger = {
            warn: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
            verbose: jest.fn(),
        };

        useCase = new GetUserIfRefreshTokenMatchesUseCase(
            mockBcryptService,
            mockUserRepository,
            mockLogger,
        );
    });

    it('should return user if refresh token matches', async () => {
        const email = 'test@email.com';
        const refreshToken = 'mockRefreshToken';
        const mockUser = {
            email,
            hashRefreshToken: 'hashedMockToken',
            id: 1,
            lastLogin: new Date(),
            password: null
        };

        mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
        mockBcryptService.compare.mockResolvedValue(true);

        const result = await useCase.execute(refreshToken, email);

        expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(email);
        expect(mockBcryptService.compare).toHaveBeenCalledWith(refreshToken, mockUser.hashRefreshToken);
        expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
        const email = 'test@email.com';
        const refreshToken = 'mockRefreshToken';

        mockUserRepository.getUserByEmail.mockResolvedValue(null);

        const result = await useCase.execute(refreshToken, email);

        expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(email);
        expect(result).toBeNull();
    });

    it('should return null and log a warning if token does not match', async () => {
        const email = 'test@email.com';
        const refreshToken = 'mockRefreshToken';
        const mockUser = {
            email,
            hashRefreshToken: 'hashedMockToken',
            id: 1,
            lastLogin: new Date(),
            password: null
        };

        mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);
        mockBcryptService.compare.mockResolvedValue(false);

        const result = await useCase.execute(refreshToken, email);

        expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(email);
        expect(mockBcryptService.compare).toHaveBeenCalledWith(refreshToken, mockUser.hashRefreshToken);
        expect(mockLogger.warn).toHaveBeenCalledWith('JwtStrategy', 'User not found or hash not correct');
        expect(result).toBeUndefined();
    });
});
