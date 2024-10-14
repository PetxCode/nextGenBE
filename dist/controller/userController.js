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
exports.deleteUserAccount = exports.readSingleAccount = exports.userAccount = exports.stage4Score = exports.stage3Score = exports.stage2Score = exports.stage1Score = exports.loginAccount = exports.createAccount = exports.createAdminAccount = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const createAdminAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, schoolName, phoneNumber, avatar } = req.body;
        const userAccount = yield userModel_1.default.create({
            name,
            email,
            password,
            schoolName,
            phoneNumber,
            avatar,
            status: "admin",
        });
        return res.status(201).json({
            message: "Admin Account created",
            data: userAccount,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error,
        });
    }
});
exports.createAdminAccount = createAdminAccount;
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, schoolName, phoneNumber, avatar } = req.body;
        const userAccount = yield userModel_1.default.create({
            name,
            email,
            password,
            schoolName,
            phoneNumber,
            avatar,
        });
        return res.status(201).json({
            message: "Account created",
            data: userAccount,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error,
        });
    }
});
exports.createAccount = createAccount;
const loginAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userAccount = yield userModel_1.default.findOne({ email });
        if (userAccount) {
            if (userAccount.password === password) {
                return res.status(201).json({
                    message: "Account created",
                    data: userAccount,
                    status: 201,
                });
            }
            else {
                return res.status(404).json({
                    message: "Error with Password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Error with Email",
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
exports.loginAccount = loginAccount;
const stage1Score = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const { mark, question, option, correct, questionID } = req.body;
        if (user) {
            const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                stage1Result: [
                    ...user === null || user === void 0 ? void 0 : user.stage1Result,
                    { mark, question, option, correct },
                ],
            }, { new: true });
            yield userModel_1.default.findByIdAndUpdate(userID, {
                stage1Score: user === null || user === void 0 ? void 0 : user.stage1Result.map((el) => el.mark).reduce((a, b) => {
                    return a + b;
                }, 0),
            }, { new: true });
            return res.status(201).json({
                message: "Account created",
                data: updated,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "user doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.stage1Score = stage1Score;
const stage2Score = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                stage2Result: [...user === null || user === void 0 ? void 0 : user.stage2Result, req.body],
            }, { new: true });
            yield userModel_1.default.findByIdAndUpdate(userID, {
                stage2Score: user === null || user === void 0 ? void 0 : user.stage2Result.map((el) => el.mark).reduce((a, b) => {
                    return a + b;
                }, 0),
            }, { new: true });
            return res.status(201).json({
                message: "user score recorded successfully",
                data: updated,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "user doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.stage2Score = stage2Score;
const stage3Score = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                stage3Result: [...user === null || user === void 0 ? void 0 : user.stage3Result, req.body],
            }, { new: true });
            yield userModel_1.default.findByIdAndUpdate(userID, {
                stage3Score: user === null || user === void 0 ? void 0 : user.stage3Result.map((el) => el.mark).reduce((a, b) => {
                    return a + b;
                }, 0),
            }, { new: true });
            return res.status(201).json({
                message: "user score recorded successfully",
                data: updated,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "user doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.stage3Score = stage3Score;
const stage4Score = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                stage4Result: [...user === null || user === void 0 ? void 0 : user.stage4Result, req.body],
            }, { new: true });
            yield userModel_1.default.findByIdAndUpdate(userID, {
                stage4Score: user === null || user === void 0 ? void 0 : user.stage4Result.map((el) => el.mark).reduce((a, b) => {
                    return a + b;
                }, 0),
            }, { new: true });
            return res.status(201).json({
                message: "user score recorded successfully",
                data: updated,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "user doesn't exist",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
exports.stage4Score = stage4Score;
const userAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        return res.status(201).json({
            message: "get all users",
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
exports.userAccount = userAccount;
const readSingleAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const users = yield userModel_1.default.findById(userID);
        return res.status(200).json({
            message: "get single user",
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
exports.readSingleAccount = readSingleAccount;
const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const users = yield userModel_1.default.findByIdAndDelete(userID);
        return res.status(201).json({
            message: "user Deleted",
            data: users,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating account",
            data: error,
        });
    }
});
exports.deleteUserAccount = deleteUserAccount;
