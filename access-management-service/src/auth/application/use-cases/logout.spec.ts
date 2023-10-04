import { LogoutUseCase } from './logout.usecase';

describe('LogoutUseCase', () => {
    let useCase: LogoutUseCase;

    beforeEach(() => {
        useCase = new LogoutUseCase();
    });

    it('should return logout cookies', () => {
        const result = useCase.logout();

        expect(result).toEqual({
            logoutCookie: [
                'Authentication=; HttpOnly; Path=/; Max-Age=0',
                'Refresh=; HttpOnly; Path=/; Max-Age=0',
            ],
        });
    });
});
