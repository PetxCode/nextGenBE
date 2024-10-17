"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gallaryModel = new mongoose_1.Schema({
    image: {
        type: String,
    },
    imageID: {
        type: String,
    },
    title: {
        type: String,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("gallaries", gallaryModel);
