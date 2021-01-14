import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppoitnemtnsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('List provider month availability', () => {
  beforeEach(() => {
    fakeAppoitnemtnsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppoitnemtnsRepository);
  })

  it('should be able to list month availability from a provider', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@test.com',
      name: 'user',
      password: '123456',
    });

    await fakeAppoitnemtnsRepository.create({
      provider_id: user.id,
      date: new Date(2021, 3, 21, 8, 0, 0),
      user_id: '321321'
    });

    await fakeAppoitnemtnsRepository.create({
      provider_id: user.id,
      date: new Date(2021, 4, 21, 8, 0, 0),
      user_id: '321321'
    });

    await fakeAppoitnemtnsRepository.create({
      provider_id: user.id,
      date: new Date(2021, 4, 21, 10, 0, 0),
      user_id: '321321'
    });

    await fakeAppoitnemtnsRepository.create({
      provider_id: user.id,
      date: new Date(2021, 4, 22, 8, 0, 0),
      user_id: '321321'
    });

    const avaliability = await listProviderMonthAvailability.execute({
      month: 5,
      year: 2020,
      provider_id: user.id,
    });

    expect(avaliability).toEqual(expect.arrayContaining([
      { day: 19, availability: true},
      { day: 20, availability: false},
      { day: 21, availability: false},
      { day: 22, availability: true},
    ]))
  });
});
