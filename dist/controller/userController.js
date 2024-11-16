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
exports.verifyTransaction = exports.makePayment = exports.gallaryView = exports.addManyImageGallary = exports.addImageGallary = exports.deleteUserAccount = exports.deleteSingleAccount = exports.readSingleAccount = exports.userAccount = exports.stage4Score = exports.stage3Score = exports.stage2Score = exports.stage1Score = exports.loginAccount = exports.createAccount = exports.createAdminAccount = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const imageGallaryModel_1 = __importDefault(require("../model/imageGallaryModel"));
const node_https_1 = __importDefault(require("node:https"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
        const { firstName, lastName, email, password, schoolName, phone, presentClass, } = req.body;
        const { secure_url } = yield cloudinary_1.default.uploader.upload(req.file.path);
        const userAccount = yield userModel_1.default.create({
            firstName,
            lastName,
            email,
            password,
            schoolName,
            phone,
            avatar: secure_url,
            presentClass,
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
        console.log(req.body);
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
        const { name, option, optionPicked, pickedAt, time, point, school, stage, correct, questionID, } = req.body;
        //
        if (user) {
            const getResult = yield userModel_1.default.findById(userID);
            const check = getResult === null || getResult === void 0 ? void 0 : getResult.stage1Result.some((el) => el.questionID === questionID);
            if (check) {
                let getData = getResult === null || getResult === void 0 ? void 0 : getResult.stage1Result.find((el) => el.questionID === questionID);
                // console.log("first approch: ", getData);
                getData = {
                    name,
                    option,
                    optionPicked,
                    pickedAt,
                    time,
                    point,
                    school,
                    stage,
                    correct,
                    questionID,
                };
                let x = getResult === null || getResult === void 0 ? void 0 : getResult.stage1Result.filter((el) => el.questionID !== questionID);
                x.push(getData);
                const dataArray = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage1Result: x,
                }, { new: true });
                const readResult = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage1Score: dataArray === null || dataArray === void 0 ? void 0 : dataArray.stage1Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: readResult,
                    status: 201,
                });
            }
            else {
                const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage1Result: [
                        ...user === null || user === void 0 ? void 0 : user.stage1Result,
                        {
                            questionID,
                            name,
                            option,
                            optionPicked,
                            pickedAt,
                            time,
                            point,
                            school,
                            stage,
                            correct,
                        },
                    ],
                }, { new: true });
                yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage1Score: updated === null || updated === void 0 ? void 0 : updated.stage1Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: updated,
                    status: 201,
                });
            }
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
        const { name, option, pickedAt, optionPicked, time, point, school, stage, correct, questionID, } = req.body;
        //
        if (user) {
            const getResult = yield userModel_1.default.findById(userID);
            const check = getResult === null || getResult === void 0 ? void 0 : getResult.stage2Result.some((el) => el.questionID === questionID);
            if (check) {
                let getData = getResult === null || getResult === void 0 ? void 0 : getResult.stage2Result.find((el) => el.questionID === questionID);
                getData = {
                    name,
                    option,
                    pickedAt,
                    time,
                    point,
                    school,
                    optionPicked,
                    stage,
                    correct,
                    questionID,
                };
                let x = getResult === null || getResult === void 0 ? void 0 : getResult.stage2Result.filter((el) => el.questionID !== questionID);
                x.push(getData);
                const data = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage2Result: x,
                }, { new: true });
                const readResult = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage2Score: data === null || data === void 0 ? void 0 : data.stage2Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: readResult,
                    status: 201,
                });
            }
            else {
                const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage2Result: [
                        ...user === null || user === void 0 ? void 0 : user.stage2Result,
                        {
                            questionID,
                            name,
                            option,
                            pickedAt,
                            optionPicked,
                            time,
                            point,
                            school,
                            stage,
                            correct,
                        },
                    ],
                }, { new: true });
                yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage2Score: updated === null || updated === void 0 ? void 0 : updated.stage2Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: updated,
                    status: 201,
                });
            }
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
        const { name, option, pickedAt, optionPicked, time, point, school, stage, correct, questionID, } = req.body;
        //
        if (user) {
            const getResult = yield userModel_1.default.findById(userID);
            const check = getResult === null || getResult === void 0 ? void 0 : getResult.stage3Result.some((el) => el.questionID === questionID);
            if (check) {
                let getData = getResult === null || getResult === void 0 ? void 0 : getResult.stage3Result.find((el) => el.questionID === questionID);
                getData = {
                    name,
                    option,
                    pickedAt,
                    optionPicked,
                    time,
                    point,
                    school,
                    stage,
                    correct,
                    questionID,
                };
                let x = getResult === null || getResult === void 0 ? void 0 : getResult.stage3Result.filter((el) => el.questionID !== questionID);
                x.push(getData);
                const data = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage3Result: x,
                }, { new: true });
                const readResult = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage3Score: data === null || data === void 0 ? void 0 : data.stage3Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: readResult,
                    status: 201,
                });
            }
            else {
                const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage3Result: [
                        ...user === null || user === void 0 ? void 0 : user.stage3Result,
                        {
                            questionID,
                            name,
                            option,
                            pickedAt,
                            optionPicked,
                            time,
                            point,
                            school,
                            stage,
                            correct,
                        },
                    ],
                }, { new: true });
                yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage3Score: updated === null || updated === void 0 ? void 0 : updated.stage3Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: updated,
                    status: 201,
                });
            }
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
        const { name, option, pickedAt, time, optionPicked, point, school, stage, correct, questionID, } = req.body;
        //
        if (user) {
            const getResult = yield userModel_1.default.findById(userID);
            const check = getResult === null || getResult === void 0 ? void 0 : getResult.stage4Result.some((el) => el.questionID === questionID);
            if (check) {
                let getData = getResult === null || getResult === void 0 ? void 0 : getResult.stage4Result.find((el) => el.questionID === questionID);
                getData = {
                    name,
                    option,
                    optionPicked,
                    pickedAt,
                    time,
                    point,
                    school,
                    stage,
                    correct,
                    questionID,
                };
                let x = getResult === null || getResult === void 0 ? void 0 : getResult.stage4Result.filter((el) => el.questionID !== questionID);
                x.push(getData);
                const data = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage4Result: x,
                }, { new: true });
                const readResult = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage4Score: data === null || data === void 0 ? void 0 : data.stage4Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: readResult,
                    status: 201,
                });
            }
            else {
                const updated = yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage4Result: [
                        ...user === null || user === void 0 ? void 0 : user.stage4Result,
                        {
                            questionID,
                            name,
                            option,
                            pickedAt,
                            optionPicked,
                            time,
                            point,
                            school,
                            stage,
                            correct,
                        },
                    ],
                }, { new: true });
                yield userModel_1.default.findByIdAndUpdate(userID, {
                    stage4Score: updated === null || updated === void 0 ? void 0 : updated.stage4Result.map((el) => el.point).reduce((a, b) => {
                        return a + b;
                    }, 0),
                }, { new: true });
                return res.status(201).json({
                    message: "result entered",
                    data: updated,
                    status: 201,
                });
            }
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
const deleteSingleAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const users = yield userModel_1.default.findByIdAndDelete(userID);
        return res.status(200).json({
            message: "delete single user",
            data: users,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error deleting account",
            data: error,
        });
    }
});
exports.deleteSingleAccount = deleteSingleAccount;
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
const addImageGallary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
        const userAccount = yield imageGallaryModel_1.default.create({
            image: secure_url,
            imageID: public_id,
            title,
        });
        return res.status(201).json({
            message: "image Gallary added successfully",
            data: userAccount,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error adding image Gallary",
            data: error,
        });
    }
});
exports.addImageGallary = addImageGallary;
const addManyImageGallary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        console.log(req === null || req === void 0 ? void 0 : req.files);
        for (let i of req === null || req === void 0 ? void 0 : req.files) {
            const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(i.path);
            yield imageGallaryModel_1.default.create({
                image: secure_url,
                imageID: public_id,
                title,
            });
        }
        return res.status(201).json({
            message: "image Gallary added successfully",
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error adding image Gallary",
            data: error,
        });
    }
});
exports.addManyImageGallary = addManyImageGallary;
const gallaryView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gallary = yield imageGallaryModel_1.default.find();
        return res.status(201).json({
            message: "get all gallary",
            data: gallary,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Errorgetting gallary",
            data: error,
        });
    }
});
exports.gallaryView = gallaryView;
// let APP_URL_DEPLOY = "http://localhost:8080";
let APP_URL_DEPLOY = "https://just-next-gen.web.app";
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, amount } = req.body;
        let token = "thank-you";
        const params = JSON.stringify({
            email,
            amount: (amount * 100).toString(),
            callback_url: `${APP_URL_DEPLOY}/${token}/successful-payment`,
            metadata: {
                cancel_action: `${APP_URL_DEPLOY}`,
            },
            channels: ["card"],
        });
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: `Bearer sk_test_c9f764c9d687cf28275c9cd131eb835393e87df6`,
                "Content-Type": "application/json",
            },
        };
        // ${process.env.APP_PAYSTACK}
        const request = node_https_1.default
            .request(options, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                return res.status(201).json({
                    message: "processing payment",
                    data: JSON.parse(data),
                    status: 201,
                });
            });
        })
            .on("error", (error) => {
            console.error(error);
        });
        request.write(params);
        request.end();
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            data: error.message,
            status: 404,
        });
    }
});
exports.makePayment = makePayment;
const verifyTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ref } = req.params;
        const url = `https://api.paystack.co/transaction/verify/${ref}`;
        yield axios_1.default
            .get(url, {
            headers: {
                Authorization: `Bearer ${process.env.APP_PAYSTACK}`,
            },
        })
            .then((data) => {
            return res.status(200).json({
                message: "payment verified",
                status: 200,
                data: data.data,
            });
        });
    }
    catch (error) {
        res.status(404).json({
            message: "Errror",
            data: error.message,
        });
    }
});
exports.verifyTransaction = verifyTransaction;
