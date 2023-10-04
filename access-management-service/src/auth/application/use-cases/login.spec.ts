import { LoginUseCase } from './login.usecase';
import {ValidateCredentialsPort} from "../ports/input/validate-credentials.port";
import {CreateCookieWithAccessTokenPort} from "../ports/input/create-cookie-with-access-token.port";
import {CreateCookieWithRefreshTokenPort} from "../ports/input/create-cookie-with-refresh-token.port";

describe('LoginUseCase', () => {
    let useCase: LoginUseCase;
    let mockValidateCredentialsPort: jest.Mocked<ValidateCredentialsPort>;
    let mockCreateCookieWithAccessTokenPort: jest.Mocked<CreateCookieWithAccessTokenPort>;
    let mockCreateCookieWithRefreshTokenPort: jest.Mocked<CreateCookieWithRefreshTokenPort>;

    beforeEach(() => {
        mockValidateCredentialsPort = {
            validateUserCredentials: jest.fn(),
        };
        mockCreateCookieWithAccessTokenPort = {
            execute: jest.fn(),
        };
        mockCreateCookieWithRefreshTokenPort = {
            createCookieWithRefreshToken: jest.fn(),
        };

        useCase = new LoginUseCase(
            mockValidateCredentialsPort,
            mockCreateCookieWithAccessTokenPort,
            mockCreateCookieWithRefreshTokenPort,
        );
    });

    it('should login user and return token bundle', async () => {
        const email = 'test@email.com';
        const pass = 'mockPassword';
        const mockAccessToken = 'mockAccessTokenCookie';
        const mockRefreshToken = 'mockRefreshTokenCookie';

        mockCreateCookieWithAccessTokenPort.execute.mockResolvedValue(mockAccessToken);
        mockCreateCookieWithRefreshTokenPort.createCookieWithRefreshToken.mockResolvedValue(mockRefreshToken);

        const result = await useCase.login(email, pass);

        expect(mockValidateCredentialsPort.validateUserCredentials).toHaveBeenCalledWith(email, pass);
        expect(mockCreateCookieWithAccessTokenPort.execute).toHaveBeenCalledWith(email);
        expect(mockCreateCookieWithRefreshTokenPort.createCookieWithRefreshToken).toHaveBeenCalledWith(email);
        expect(result).toEqual({
            accessTokenCookie: mockAccessToken,
            refreshTokenCookie: mockRefreshToken,
        });
    });
});
