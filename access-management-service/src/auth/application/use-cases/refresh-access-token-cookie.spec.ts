import {RefreshAccessTokenCookieUseCase} from './refresh-access-token-cookie.usecase';
import {GetUserIfRefreshTokenMatchesPort} from "../ports/input/get-user-if-refresh-token-matches.port";
import {CreateCookieWithAccessTokenPort} from "../ports/input/create-cookie-with-access-token.port";
import {JWTPort} from "../ports/output/jwt.port";

describe('RefreshAccessTokenCookieUseCase', () => {
    let useCase: RefreshAccessTokenCookieUseCase;
    let mockGetUserIfRefreshTokenMatchesPort: jest.Mocked<GetUserIfRefreshTokenMatchesPort>;
    let mockCreateCookieWithAccessTokenPort: jest.Mocked<CreateCookieWithAccessTokenPort>;
    let mockJWTPort: jest.Mocked<JWTPort>;

    beforeEach(() => {
        mockGetUserIfRefreshTokenMatchesPort = {
            execute: jest.fn(),
        };
        mockCreateCookieWithAccessTokenPort = {
            execute: jest.fn(),
        };
        mockJWTPort = {
            checkToken: jest.fn(),
            createToken: jest.fn()
        };

        useCase = new RefreshAccessTokenCookieUseCase(
            mockGetUserIfRefreshTokenMatchesPort,
            mockCreateCookieWithAccessTokenPort,
            mockJWTPort,
        );
    });

    it('should refresh access token cookie', async () => {
        const refreshToken = 'mockRefreshToken';
        const mockEmail = 'test@email.com';
        const mockTokenPayload = {email: mockEmail};
        const mockAccessTokenCookie = 'mockAccessTokenCookie';

        mockJWTPort.checkToken.mockResolvedValue(mockTokenPayload);
        mockGetUserIfRefreshTokenMatchesPort.execute.mockResolvedValue({
            email: mockEmail,
            hashRefreshToken: 'mockHashedToken',
            password: null,
            id: 1,
            lastLogin: new Date()
        });
        mockCreateCookieWithAccessTokenPort.execute.mockResolvedValue(mockAccessTokenCookie);

        const result = await useCase.execute(refreshToken);

        expect(mockJWTPort.checkToken).toHaveBeenCalledWith(refreshToken);
        expect(mockGetUserIfRefreshTokenMatchesPort.execute).toHaveBeenCalledWith(refreshToken, mockEmail);
        expect(mockCreateCookieWithAccessTokenPort.execute).toHaveBeenCalledWith(mockEmail);
        expect(result).toBe(mockAccessTokenCookie);
    });
});
