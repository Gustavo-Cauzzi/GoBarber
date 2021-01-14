import { getRepository, Not, Repository} from 'typeorm'

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IFindAllUsers from "@modules/users/dtos/IFindAllUsers";

import User from '../entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import usersRouter from '../../http/routes/users.routes';

//2

class UsersRepository implements IUserRepository{
  private ormRepository: Repository<User>;

  constructor(){
    this.ormRepository = getRepository(User)
  }

  public async findAllUsers({ exception_id }: IFindAllUsers): Promise<User[]> {
    let users: User[];

    if(exception_id){
      users = await this.ormRepository.find({
        where: {
          id: Not(exception_id)
        }
      });
    }else{
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email }
    })

    return user;
  }

  public async create({name, email, password}: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  };

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;


/*

  1- SEMPRE QUANDO TEM UMA FUNÇÃO ASSÍNCRONA, O RESULTADO
  DELA É UMA PROMISE DE ALGUM TIPO

*/
