import { Router } from "express";
import {
  createQuestionByAdmin,
  readQuestionByAdmin,
  readStageQuestionByAdmin,
  updateQuestionByAdmin,
} from "../controller/questionController";

const router: Router = Router();

router.route("/create-question/:userID").post(createQuestionByAdmin);
router.route("/read-question").get(readQuestionByAdmin);

router
  .route("/read-stage-question/:stage/:questionID")
  .get(readStageQuestionByAdmin);

router
  .route("/read-next-question/:userID/:mainID")
  .patch(updateQuestionByAdmin);
export default router;
