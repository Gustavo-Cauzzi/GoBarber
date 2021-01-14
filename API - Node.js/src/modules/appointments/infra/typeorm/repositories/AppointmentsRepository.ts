import { getRepository, Raw, Repository} from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '../entities/Appointment';
import ICreateAppointment from '@modules/appointments/dtos/ICreateAppointment';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

//2

class AppointmentsRepository implements IAppointmentsRepository{
  private ormRepository: Repository<Appointment>;

  constructor(){
    this.ormRepository = getRepository(Appointment)
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> /* 1 */{
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    })

    return findAppointment;
  };

  public async create({provider_id, date, user_id}: ICreateAppointment): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0'); //  1 => '01' | 2 => '02' | 11 = "11"

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dataFieldName =>
          `to_char(${dataFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
          )
        }
      })

      return appointments;
    }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user']
    });

    return appointments;
  }

}

export default AppointmentsRepository;


/*

  1- SEMPRE QUANDO TEM UMA FUNÇÃO ASSÍNCRONA, O RESULTADO
  DELA É UMA PROMISE DE ALGUM TIPO

*/
