import {Router} from "express";
import multer from "multer";
import uploadConfig from "@config/upload";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import UsersController from "@modules/users/controllers/UsersController";
import UserAvatarController from "@modules/users/controllers/UserAvatarController";
import {celebrate, Joi, Segments} from "celebrate";

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const usersRouter = Router();
const upload = multer(uploadConfig.multer);

usersRouter.post('/', celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    },
}), usersController.create);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.create);

export default usersRouter;
