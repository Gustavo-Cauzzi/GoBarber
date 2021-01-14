import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { format, isBefore, startOfHour, getHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest{
  provider_id: string;
  date: Date;
  user_id: string;
}

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ){}


  public async execute({ provider_id, date, user_id}: IRequest): Promise<Appointment> /* 2 */{
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointemnt on a past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

/*

  1 - Na linha 25, apenas é criado a instância lá dentro
  do typeorm, então, para que consiguamos realmente inserir
  essa instância no banco, temos que executar um .save()
  passando por parametro a instancia. (tem que ser assíncrona,
  pois é uma promise)

  2 - SEMPRE QUANDO TEM UMA FUNÇÃO ASSÍNCRONA, O RESULTADO
  DELA É UMA PROMISE DE ALGUM TIPO


  yarn add bcyrptjs
  yarn add -D @types/bcryptjs

*/
