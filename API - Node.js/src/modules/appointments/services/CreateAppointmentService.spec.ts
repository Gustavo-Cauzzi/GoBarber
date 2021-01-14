import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { create } from 'handlebars';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  });

  it('should be able to create an apointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123132',
      user_id: '321321'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123132')
  });

  it('should not be able to create a new appointment on the same date', async () => {
    await createAppointment.execute({
      date: new Date(2021, 4, 16, 11),
      provider_id: '123132',
      user_id: '321321'
    });

    expect(createAppointment.execute({
      date: new Date(2021, 4, 16, 11),
      provider_id: '123132',
      user_id: '321321'
    })).rejects.toBeInstanceOf(AppError);
  })
})
