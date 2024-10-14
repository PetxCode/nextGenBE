import { Router } from "express";
import {
  createAccount,
  loginAccount,
  readSingleAccount,
  stage1Score,
  userAccount,
} from "../controller/userController";
import multer from "multer";
const router: Router = Router();
import { fileUpload } from "../utils/multer";
const upload = multer().single("avatar");

router.route("/register").post(fileUpload, createAccount);
router.route("/login").post(loginAccount);
router.route("/stage-one/:userID").patch(stage1Score);
router.route("/user/:userID").get(readSingleAccount);
router.route("/users/").get(userAccount);
export default router;
