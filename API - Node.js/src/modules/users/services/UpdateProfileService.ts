import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { check } from 'prettier';

interface IRequest{
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider

  ){
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id, name, email, password, old_password}: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user){
      throw new AppError("User not found");
    }

    const userWithThatEmail = await this.usersRepository.findByEmail(email);

    if(userWithThatEmail && userWithThatEmail.id != user_id){
      throw new AppError("Email already used");
    }

    user.name = name;
    user.email = email;

    if(password && !old_password){
      throw new AppError("Old password needed to change password");
    }

    if(password && old_password){
      const checkOldPassword = await this.hashProvider.compare(old_password, user.password);

      if(!checkOldPassword){
        throw new AppError("Wrong old password");
      }
      user.password = await this.hashProvider.hash(password);
    }

    return this.usersRepository.save(user);
  }
}
