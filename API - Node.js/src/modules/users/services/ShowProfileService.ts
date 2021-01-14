import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest{
  user_id: string;
}

@injectable()
export default class UpdateProfileService{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ){}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user){
      throw new AppError("User not found");
    }

    return user;
  }
}
