import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICasheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest{
  user_id: string;
}

@injectable()
export default class ListProvidersService{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICasheProvider,
  ){}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    if(!users){
      users = await this.usersRepository.findAllUsers({
        exception_id: user_id,
      });

      await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users));
    }

    return users;
  }
}
