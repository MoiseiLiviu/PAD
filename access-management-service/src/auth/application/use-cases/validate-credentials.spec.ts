import { ValidateCredentialsUseCase } from './validate-credentials.usecase';

import { LoggerPort } from '@nest-upskilling/common';
import { UnauthorizedException } from "@nestjs/common";
import {UserRepository} from "../../../user/domain/core/repositories/user-repository.interface";
import {BcryptPort} from "../ports/output/bcrypt.port";
import {User} from "../../../user/domain/core/models/user.model";

describe('ValidateCredentialsUseCase', () => {
    let useCase: ValidateCredentialsUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockBcryptService: jest.Mocked<BcryptPort>;
    let mockLogger: jest.Mocked<LoggerPort>;

    beforeEach(() => {
        mockUserRepository = {
            getUserByEmail: jest.fn(),
            updateLastLogin: jest.fn(),
            save: jest.fn(),
            getById: jest.fn(),
            updateRefreshToken: jest.fn(),
        };

        mockBcryptService = {
            compare: jest.fn(),
            hash: jest.fn(),
        };

        mockLogger = {
            warn: jest.fn(),
            log: jest.fn(),
            verbose: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        };

        useCase = new ValidateCredentialsUseCase(mockUserRepository, mockBcryptService, mockLogger);
    });

    it('should throw UnauthorizedException if email or password is missing', async () => {
        await expect(useCase.validateUserCredentials('', 'password')).rejects.toThrow(UnauthorizedException);
        await expect(useCase.validateUserCredentials('test@email.com', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
        mockUserRepository.getUserByEmail.mockResolvedValue(null);

        const email = 'test@email.com';
        await expect(useCase.validateUserCredentials(email, 'password')).rejects.toThrow(UnauthorizedException);
        expect(mockLogger.warn).toHaveBeenCalledWith('ValidateUserCredentialsUseCase', `User not found with the email ${email}`);
    });

    it('should return user data if credentials are valid', async () => {
        const user = new User();
        user.email = 'test@email.com';
        user.password = 'hashedPassword';
        user.id = 1;

        mockUserRepository.getUserByEmail.mockResolvedValue(user);
        mockBcryptService.compare.mockResolvedValue(true);

        const result = await useCase.validateUserCredentials(user.email, 'password');

        expect(result).toEqual({ email: user.email, id: user.id });
        expect(mockUserRepository.updateLastLogin).toHaveBeenCalledWith(user.email);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
        const user = new User();
        user.email = 'test@email.com';
        user.password = 'hashedPassword';
        user.id = 1;

        mockUserRepository.getUserByEmail.mockResolvedValue(user);
        mockBcryptService.compare.mockResolvedValue(false);

        await expect(useCase.validateUserCredentials(user.email, 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });
});
