import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import ShowProfileService from '@modules/users/services/ShowProfileService'

export default class UpdateProfileController{
  public async show(request: Request, response: Response): Promise<Response>{
    const user_id = request.user.id;

    const shwoProfile = container.resolve(ShowProfileService);

    const user = await shwoProfile.execute({
      user_id,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response>{
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password
    });

    return response.json(user);
  }
}