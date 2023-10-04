import {ValidateAccessTokenUseCase} from './validate-access-token.usecase';
import {HttpStatus} from '@nestjs/common';
import {JWTPort} from "../ports/output/jwt.port";
import {UserRepository} from "../../../user/domain/core/repositories/user-repository.interface";
import {TokenPayload} from "../../domain/core/model/auth";
import {User} from "../../../user/domain/core/models/user.model";

describe('ValidateAccessTokenUseCase', () => {
    let useCase: ValidateAccessTokenUseCase;
    let mockJwt: jest.Mocked<JWTPort>;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockJwt = {
            checkToken: jest.fn(),
            createToken: jest.fn()
        };

        mockUserRepository = {
            getUserByEmail: jest.fn(),
            getById: jest.fn(),
            save: jest.fn(),
            updateLastLogin: jest.fn(),
            updateRefreshToken: jest.fn(),
        };

        useCase = new ValidateAccessTokenUseCase(mockJwt, mockUserRepository);
    });

    it('should return forbidden status if token is invalid', async () => {
        const token = 'invalidToken';
        mockJwt.checkToken.mockResolvedValue(null);

        const result = await useCase.execute(token);

        expect(result.status).toEqual(HttpStatus.FORBIDDEN);
        expect(result.error).toEqual(['Token is invalid']);
        expect(result.userId).toBeNull();
    });

    it('should return conflict status if user is not found', async () => {
        const token = 'validToken';
        const decodedPayload: TokenPayload = {email: 'test@email.com', userId: 1};
        mockJwt.checkToken.mockResolvedValue(decodedPayload);
        mockUserRepository.getUserByEmail.mockResolvedValue(null);

        const result = await useCase.execute(token);

        expect(result.status).toEqual(HttpStatus.CONFLICT);
        expect(result.error).toEqual(['User not found']);
        expect(result.userId).toBeNull();
    });

    it('should return OK status if token is valid and user is found', async () => {
        const token = 'validToken';
        const userId = 123;
        const decodedPayload: TokenPayload = {email: 'test@email.com', userId: userId};
        mockJwt.checkToken.mockResolvedValue(decodedPayload);
        const mockUser = new User();
        mockUser.id = userId;
        mockUser.email = decodedPayload.email;
        mockUserRepository.getUserByEmail.mockResolvedValue(mockUser);

        const result = await useCase.execute(token);

        expect(result.status).toEqual(HttpStatus.OK);
        expect(result.error).toBeNull();
        expect(result.userId).toEqual(userId);
    });
});
