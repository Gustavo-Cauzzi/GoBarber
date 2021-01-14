import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider= new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider,fakeCacheProvider);
    authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);
  })

  it('should be able to authenticate an user', async () => {
      const user = await createUser.execute({
      email: 'teste@teste.com',
      name: 'teste',
      password: '123123123'
    });

    const response = await authenticateUser.execute({
      email: 'teste@teste.com',
      password: '123123123'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with a non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'non_existing_user@non_existing_user.com',
      password: '123123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with an invalid password', async () => {
    await createUser.execute({
      email: 'non_existing_user@non_existing_user.com',
      name: 'non_existing_user',
      password: '123'
    });

    await expect(authenticateUser.execute({
      email: 'non_existing_user@non_existing_user.com',
      password: '123123123'
    })).rejects.toBeInstanceOf(AppError);
  });
})
