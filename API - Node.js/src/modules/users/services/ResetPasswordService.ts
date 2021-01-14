import User from '../infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { addHours, isAfter } from 'date-fns';

interface IRequest{
  password: string;
  token: string;
}

@injectable()
export default class SendForgotPasswordEmailPassword{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject("UserTokensRepository")
    private userTokenRepository: IUserTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,
  ){}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findUserByToken(token);

    if(!userToken){
      throw new AppError('User token does not exists')
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user){
      throw new AppError('User does not exists')
    }

    const tokenCreateAt = userToken.created_at;
    const compareDate = addHours(tokenCreateAt, 2);

    if(isAfter(Date.now(), compareDate)){
      throw new AppError("Token is expired");
    }

    user.password = await this.hashProvider.hash(password);

    await this.usersRepository.save(user);
  }
}
