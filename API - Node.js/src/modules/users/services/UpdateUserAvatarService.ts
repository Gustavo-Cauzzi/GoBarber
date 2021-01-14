import path from 'path';
import { inject, injectable } from 'tsyringe';
import fs from 'fs'; // File System (node)

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import IUserRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest{
  user_id: string,
  avatarFileName: string,
}

@injectable()
export default class UpdateUserAvatarService{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider

  ){
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if(!user){
      throw new AppError('Only authenticated can change avatar', 401);
    }

    if(user.avatar){ //then {Deletar...}
      const userAvatarFilePath = path.join(uploadConfig.uploadsFolder, user.avatar)// 1
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath) // 2

      if(userAvatarFileExists){
        this.storageProvider.deleteFile(user.avatar);
      }
    }

    const filename = await this.storageProvider.saveFile(avatarFileName)

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

/*

  1 - path.join() = juntar dois caminhos para
  formar apenas um

  2 - Checar se o arquivo existe com o File System (fs) do node.
    -> A função stat() retorna um undefined caso ele não exista
    -> O ".promises" serve para executarmos em formato de pro-
    mise do js para podermos usar o await ao envés de usar
    um callback.

  3 - .unlink() deleta um arquivo do File System (fs)
 */
