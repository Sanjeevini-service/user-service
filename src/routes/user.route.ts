import { Router } from "express";
import UserController from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema, updateUserSchema } from "../schema/user.schema";
import requireUser from "../middleware/requireUser";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getUsers);

userRouter.get("/:id", userController.getUserById);

userRouter.post("/", userController.getUserByEmail);

userRouter.post("/create", requireUser, validateResource(createUserSchema), userController.createUser);

userRouter.post("/update/:id", validateResource(updateUserSchema), userController.updateUser);

userRouter.delete("/:id", userController.delete);

export default userRouter;
