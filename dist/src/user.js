"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserValidator_1 = require("./validator/UserValidator");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.render('index', { index: 'Stayin alive', message: 'We can try to understand...nope' });
});
router.get('/create', (req, res) => {
    res.render('user_register', {
        title: 'Register',
        flash: req.session.flash
    });
});
router.post('/', UserValidator_1.createUser, (req, res) => {
    const { username, email, password } = req.body;
    res.end('Ku bersuara');
});
router.get('/:id', (req, res) => {
    res.end('find a user');
});
router.get('/:id/edit', (req, res) => { });
router.post('/:id', (req, res) => {
    res.end('update a user');
});
exports.default = router;
