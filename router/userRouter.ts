import { Router } from "express";
import {
  addImageGallary,
  addManyImageGallary,
  createAccount,
  gallaryView,
  loginAccount,
  readSingleAccount,
  stage1Score,
  stage2Score,
  stage3Score,
  stage4Score,
  userAccount,
  deleteSingleAccount,
  makePayment,
  verifyTransaction,
} from "../controller/userController";
const router: Router = Router();
import { fileManyUpload, fileUpload } from "../utils/multer";

router.route("/multi-upload").post(fileManyUpload, addManyImageGallary);
router.route("/single-upload").post(fileUpload, addImageGallary);
router.route("/view-gallary").get(gallaryView);

router.route("/register").post(fileUpload, createAccount);
router.route("/login").post(loginAccount);
router.route("/stage-one/:userID").patch(stage1Score);
router.route("/stage-2/:userID").patch(stage2Score);
router.route("/stage-3/:userID").patch(stage3Score);
router.route("/stage-4/:userID").patch(stage4Score);
router.route("/user/:userID").get(readSingleAccount);
router.route("/delete/:userID").delete(deleteSingleAccount);
router.route("/users/").get(userAccount);

router.route("/donate/").post(makePayment);
router.route("/verify-donation/:ref").get(verifyTransaction);
export default router;
