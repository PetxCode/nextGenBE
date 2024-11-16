"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionController_1 = require("../controller/questionController");
const router = (0, express_1.Router)();
router.route("/create-question/:userID").post(questionController_1.createQuestionByAdmin);
router.route("/read-question").get(questionController_1.readQuestionByAdmin);
router
    .route("/read-stage-question/:stage/:questionID")
    .get(questionController_1.readStageQuestionByAdmin);
router
    .route("/read-next-question/:userID/:mainID")
    .patch(questionController_1.updateQuestionByAdmin);
exports.default = router;
