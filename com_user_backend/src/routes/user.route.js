import express from "express";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", userController.getAllUsers);
router.post("/add", userController.createUser);
router.patch("/:id", userController.updateUser);
router.patch("/:id/migrate", userController.migrateUser);
router.patch("/:id/deactivate", userController.deactivateUser);
router.delete("/:id", userController.deleteUser);

export default router;
