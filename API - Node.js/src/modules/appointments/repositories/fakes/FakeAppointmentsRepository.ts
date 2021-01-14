import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import Appointment from '../../infra/typeorm/entities/Appointment';

import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
//2

class AppointmentsRepository implements IAppointmentsRepository{
private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> /* 1 */{
    const appointment = this.appointments.find(appo => isEqual(appo.date,date));

    return appointment;
  };

  public async create({provider_id, date}: ICreateAppointment): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid() , date, provider_id});

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({ provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id == provider_id &&
      getMonth(appointment.date) + 1 == month &&
      getYear(appointment.date) == year
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }
}

export default AppointmentsRepository;
