import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('Update user avatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository,fakeStorageProvider);
  })

  it('should be able to update an user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: 'johndoe@teste.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update an user avatar of a non existing user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: "non-existing-user",
      avatarFileName: 'avatar.png',
    })).rejects.toBeInstanceOf(AppError);
  });

  // it('should delete old avatar when updating a new one', async () => {
  //   const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

  //   const user = await fakeUsersRepository.create({
  //     name: "John Doe",
  //     email: 'johndoe@teste.com',
  //     password: '123456',
  //   });

  //   await updateUserAvatar.execute({
  //     user_id: user.id,
  //     avatarFileName: 'avatar.png',
  //   });

  //   await updateUserAvatar.execute({
  //     user_id: user.id,
  //     avatarFileName: 'avatar2.png',
  //   });

  //   expect(deleteFile).toHaveBeenCalledWith('avatar.png')
  //   expect(user.avatar).toBe('avatar2.png');
  // })
});
