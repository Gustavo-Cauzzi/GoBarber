import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe';
import authConfig from '@config/auth'; //2

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest{
  email: string;
  password: string;
}

interface IResponse{
  user: User,
  token: string
}

@injectable()
export default class AuthanticateUserService{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ){
    this.usersRepository = usersRepository;
  }


  public async execute({ email, password }: IRequest): Promise<IResponse>{
    const user = await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError("Incorrect email/password combination", 401); // 3
    }

    // user.password = Senha Criptografada
    // password = Senha não-criptgrafada (tentando fazer login)

    const passwordMatched = await this.hashProvider.compare(password, user.password); //1

    if(!passwordMatched){
      throw new AppError("Incorrect email/password combination", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({  }, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    });

    return {
      user,
      token
    }
  }
}
/*

  1 - compare() =
    Função do bcryptjs que tem a possibilidade
    de comparar uma senha criptgrafada
    com uma não criptografada.
    (RETORNA UM BOOLEAN
      true - Bateu
      false - Não Bateu
    )

  2 - authConfig é um arquivo (auth.ts) que guarda umas
  informações que precisamos sobre o token, pelo fato que
  iremos precisar desses dados em mais de um lugar, é interes-
  sante deixa-los de acesso à todos

  3 - AppError = classe de erro própria (pasta /errors/AppError)


  yarn add jsonwebtoken
  yarn add -D @types/jsonwebtoken
*/
