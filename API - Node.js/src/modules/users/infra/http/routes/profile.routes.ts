import { Router } from 'express';

import UpdateProfileController from '../controllers/UpdateProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

const updateProfileController = new UpdateProfileController();

profileRouter.put('/', updateProfileController.update);
profileRouter.get('/', updateProfileController.show);

export default profileRouter;
