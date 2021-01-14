import { getRepository, Repository} from 'typeorm'

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import User from '../entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import UserToken from '../entities/UserToken';
import { uuid } from 'uuidv4';

//2

class UserTokensRepository implements IUserTokensRepository{
  private ormRepository: Repository<UserToken>;

  constructor(){
    this.ormRepository = getRepository(UserToken)
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findUserByToken(token: string): Promise<UserToken | undefined>{
    const userToken = this.ormRepository.findOne(
      {where: { token }}
    );

    return userToken;
  }

}

export default UserTokensRepository;
