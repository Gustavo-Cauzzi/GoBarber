import { getRepository, Repository} from 'typeorm'

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';

//2

class FakeUserTokensRepository implements IUserTokensRepository{
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      updated_at: new Date(),
      created_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findUserByToken(token: string): Promise<UserToken | undefined>{
    const findUser = this.userTokens.find(findToken => findToken.token == token);

    return findUser;
  }
}

export default FakeUserTokensRepository;
