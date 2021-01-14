import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('Update profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository,fakeHashProvider);
  })

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'user2',
      email: 'user2@example.com',
    });

    expect(updatedUser.name).toBe('user2');
    expect(updatedUser.email).toBe('user2@example.com');
  });

  it('should not be able to change email to another user email', async () => {
    await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123123',
    });

    const user = await fakeUsersRepository.create({
      email:'user2@example.com',
      name:'user2',
      password:'123123',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'user3',
      email: 'user1@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change password', async () => {
    const user = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'user2',
      email: 'user2@example.com',
      old_password: '123456',
      password: '123123'
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to change password without informing old_password', async () => {
    const user = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123456',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'user2',
      email: 'user2@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change password informing wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123456',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'user2',
      email: 'user2@example.com',
      old_password: 'wrong-old-password',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });
});
