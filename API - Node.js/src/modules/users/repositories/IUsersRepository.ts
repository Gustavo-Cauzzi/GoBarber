import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IFindAllUsers from "../dtos/IFindAllUsers";
import User from "../infra/typeorm/entities/User";

export default interface IUsersRepository {
  findAllUsers(data?: IFindAllUsers): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
