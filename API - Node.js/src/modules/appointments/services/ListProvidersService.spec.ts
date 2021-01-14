import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('List providers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider= new FakeCacheProvider();
    listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  })

  it('should be able to list all users', async () => {
    const user1 = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123123',
    });

    const user2 = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123123',
    });

    const loggedUser = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123123',
    });

    const allUsers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(allUsers).toEqual([user1, user2]);
  });
});
