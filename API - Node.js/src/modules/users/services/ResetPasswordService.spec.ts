import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  })

  it('should be able to reset password', async () => {
    const hash = jest.spyOn(fakeHashProvider, 'hash');

    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'teste',
      password: 'teste',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(hash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset password with a invalid token', async () => {
    await expect(resetPassword.execute({
      password: '123456',
      token: '999',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with a invalid user', async () => {
    const { token } = await fakeUserTokensRepository.generate('123456789');

    await expect(resetPassword.execute({
      password: '123123',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed 2 hours from token emission', async () => {
    const user = await fakeUsersRepository.create({
      email: 'teste@teste.com',
      name: 'teste',
      password: 'teste',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPassword.execute({
      password: '123123',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });
})
