"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readStageQuestionByAdmin = exports.updateQuestionByAdmin = exports.readQuestionByAdmin = exports.createQuestionByAdmin = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const testQuestionModel_1 = __importDefault(require("../model/testQuestionModel"));
const question_1 = require("../question");
const createQuestionByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const userAccount = yield userModel_1.default.findById(userID);
        if ((userAccount === null || userAccount === void 0 ? void 0 : userAccount.status) === "admin") {
            yield testQuestionModel_1.default.deleteMany();
            const questionData = yield testQuestionModel_1.default.create({
                question: question_1.question,
            });
            return res.status(201).json({
                message: "Admin Account created",
                data: questionData,
                status: 201,
            });
        }
        else {
            return res.status(403).json({
                message: "You are not authorized to create admin account",
                data: null,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error,
        });
    }
});
exports.createQuestionByAdmin = createQuestionByAdmin;
const readQuestionByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield testQuestionModel_1.default.find();
        return res.status(201).json({
            message: "get all test question",
            data: users,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error,
        });
    }
});
exports.readQuestionByAdmin = readQuestionByAdmin;
const updateQuestionByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { userID, mainID } = req.params;
        const { stage, questionID } = req.body;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const question = yield testQuestionModel_1.default.find();
            yield testQuestionModel_1.default.findByIdAndUpdate(mainID, {
                question: Object.assign(Object.assign({}, question[0].question), { [`${stage}`]: {
                        data: (_b = (_a = question[0].question[`${stage}`]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map((el) => {
                            if (el.id === questionID) {
                                el.start = true;
                            }
                            return el;
                        }),
                    } }),
            }, { new: true });
            const read = question[0].question[`${stage}`].data.filter((el) => {
                return el.start === true;
            });
            const specific = read.find((el) => {
                return el.id === parseInt(questionID);
            });
            yield testQuestionModel_1.default.findByIdAndUpdate(mainID, {
                specific,
            }, { new: true });
            return res.status(201).json({
                message: "question updated successfully",
                read: (_c = question[0]) === null || _c === void 0 ? void 0 : _c.specific,
                data: question,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "You are not Authorized",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error ",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.updateQuestionByAdmin = updateQuestionByAdmin;
const readStageQuestionByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionID, stage } = req.params;
        const question = yield testQuestionModel_1.default.find();
        const read = question[0].question[`${stage}`].data.filter((el) => {
            return el.start === true;
        });
        const specific = read.find((el) => {
            return el.id === parseInt(questionID);
        });
        return res.status(200).json({
            message: "question updated successfully",
            specific,
            read,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error ",
            data: error,
        });
    }
});
exports.readStageQuestionByAdmin = readStageQuestionByAdmin;
