"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const express_validator_1 = require("express-validator");
exports.createUser = (req, res, next) => {
    Promise.all([
        express_validator_1.check('username', 'Invalid username')
            .isLength({ min: 5 }).run(req),
        express_validator_1.check('email', 'Invalid email')
            .isEmail().run(req)
    ])
        .then(() => {
        redirectBadRequest(res, req, '/user/create');
        next();
    });
};
const redirectBadRequest = (res, req, redirectUrl) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        const msg = errors.array().map((err) => {
            return err.msg;
        });
        req.session.flash = { ct: 0, msg: msg };
        res.redirect(redirectUrl);
    }
};
