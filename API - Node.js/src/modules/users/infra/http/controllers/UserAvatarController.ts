import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UploadUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserController{
  public async update(request: Request, response: Response): Promise<Response>{
    const updateUserAvatar = container.resolve(UploadUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(classToClass(user))
  }
}
