import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'teste@teste.com',
      name: 'teste',
      password: '123123123',
    });

    expect(user).toHaveProperty('id')
  });

  it("should not be able to create an user with the same email", async () => {
    await createUser.execute({
      name: 'Somebody Lee',
      email: 'somebodylee@something.com',
      password:'123123123',
    });

    await expect(createUser.execute({
      name: 'Somebodyelse Lee',
      email:"somebodylee@something.com",
      password: '456456456'
    })).rejects.toBeInstanceOf(AppError);
  })
})
