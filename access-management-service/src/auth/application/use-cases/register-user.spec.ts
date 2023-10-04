import {RegisterUserUseCase} from "./register-user-use.case";
import {UserRepository} from "../../../user/domain/core/repositories/user-repository.interface";
import {BcryptPort} from "../ports/output/bcrypt.port";
import {User, UserWithoutPassword} from "../../../user/domain/core/models/user.model";
import {CreateUserCommand} from "../dto/create-user.command";

describe('RegisterUserUseCase', () => {
    let useCase: RegisterUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockBcryptPort: jest.Mocked<BcryptPort>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            getUserByEmail: jest.fn(),
            getById: jest.fn(),
            updateLastLogin: jest.fn(),
            updateRefreshToken: jest.fn(),
        };
        mockBcryptPort = {
            hash: jest.fn(),
            compare: jest.fn(),
        };

        useCase = new RegisterUserUseCase(mockUserRepository, mockBcryptPort);
    });

    it('should create user', async () => {
        const email = 'test@email.com';
        const password = 'mockPassword';
        const hashedPassword = 'hashedMockPassword';
        const mockUser: UserWithoutPassword = {
            email: email,
            id: 1,
            lastLogin: new Date(),
            hashRefreshToken: null,
        };

        const resultUser: User = {
            ...mockUser,
            password: hashedPassword,
        }

        const newUser = new User()
        newUser.password = hashedPassword;
        newUser.email = email;

        const createUserCommand: CreateUserCommand = {
            email: email,
            password: password,
        };

        mockBcryptPort.hash.mockResolvedValue(hashedPassword);
        mockUserRepository.save.mockResolvedValue(resultUser);

        const result = await useCase.createUser(createUserCommand);

        expect(mockBcryptPort.hash).toHaveBeenCalledWith(password);
        expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
        expect(result).toEqual(mockUser);
    });
});
