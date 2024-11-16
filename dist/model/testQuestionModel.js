"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionModel = new mongoose_1.Schema({
    question: {
        type: Object,
        required: true,
    },
    specific: {
        type: Object,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("questions", questionModel);
