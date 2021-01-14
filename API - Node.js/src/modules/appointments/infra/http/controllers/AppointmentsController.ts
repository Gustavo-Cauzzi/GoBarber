import { Request, Response } from 'express';
import { getTime, parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController{
  public async create(request: Request,response: Response): Promise<Response>{
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService); // container.resolve( NOME_DO_SERVICE )

    const appointment = await createAppointment.execute({
      provider_id,
      date,
      user_id
    });

    return response.json(appointment);
  }
}
// 2020-10-01T23:38:36.580Z
