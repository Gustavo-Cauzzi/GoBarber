import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IFindAllUsers from "@modules/users/dtos/IFindAllUsers";

import User from '../../infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';

//2

export default class FakeUsersRepository implements IUserRepository{
  private usersRepository: User[] = [];

  public async findAllUsers({ exception_id }: IFindAllUsers): Promise<User[]> {
    let users = this.usersRepository;

    if(exception_id){
      users = users.filter(user => user.id != exception_id);
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.usersRepository.find(u => u.id == id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.usersRepository.find(u => u.email == email)

    return user;
  }

  public async create({name, email, password}: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password});

    this.usersRepository.push(user);

    return user;
  };

  public async save(user: User): Promise<User> {
    const index = this.usersRepository.findIndex(findUser => findUser.id == user.id);

    this.usersRepository[index] = user;

    return user;
  }
}
