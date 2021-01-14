import Appointment from "../infra/typeorm/entities/Appointment";
import ICreateAppointment from '../dtos/ICreateAppointment';
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointment): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>;
  findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO): Promise<Appointment[]>;
}

