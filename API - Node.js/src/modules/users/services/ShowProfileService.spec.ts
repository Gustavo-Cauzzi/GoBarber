import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('Update profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  })

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      email:'user1@example.com',
      name:'user1',
      password:'123123',
    });

    const updatedUser = await showProfile.execute({
      user_id: user.id,
    });

    expect(updatedUser.name).toBe('user1');
    expect(updatedUser.email).toBe('user1@example.com');
  });

  it('should not be able to show the profile with a invalid user ID', async () => {
    await expect(
      showProfile.execute({
        user_id: "non-existing-id",
      }
    )).rejects.toBeInstanceOf(AppError);
  });

});
