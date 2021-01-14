import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
)//2

export default usersRouter;

/*

  1 - .find()  é tipo um select do typeorm. Dentro
  dele da pra passar um { where: { ... } }

  2- patch - atualizar só um informmaçãozinha
  (tipo o put, mas menor)


  yarn add multer  ->> Upload de arquivo
*/
