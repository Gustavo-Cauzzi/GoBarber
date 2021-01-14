import User from '../infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest{
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService{
  private usersRepository: IUserRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ){
    this.usersRepository = usersRepository;
  }

  public async execute({ name, email, password}: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if(checkUserExists){
      throw new AppError('Email already used');
    }

    const hashedPassword = await this.hashProvider.hash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}
