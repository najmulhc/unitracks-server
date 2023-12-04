"use strict";
// input phase 1 (basic personal information)
// input phase 2 (academics information)
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudent = void 0;
var getStudent = function (req, res) {
    try {
    }
    catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStudent = getStudent;
