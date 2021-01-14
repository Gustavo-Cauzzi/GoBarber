import { inject, injectable } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest{
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailPassword{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("UserTokensRepository")
    private userTokenRepository: IUserTokensRepository,
  ){}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError('Cannot send Forgot Password Email to a non-existing email',401)
    }

    const {token} = await this.userTokenRepository.generate(user.id);

    const templatePath = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[GoBarber] Recuperação de Senha',
      templateData: {
        file: templatePath,
        variables: {
          name: user.name,
          link:`http://localhost:3000/reset-password?token=${token}`,
        },
      },
    });
  }
}
