"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const user_1 = __importDefault(require("./user"));
const app = express_1.default();
app.set('view engine', 'pug');
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_session_1.default({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    if (req.session.flash) {
        if (req.session.flash.ct) {
            req.session.flash = undefined;
        }
        else {
            req.session.flash.ct++;
        }
    }
    next();
});
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Welcome',
        message: 'It\'s a man world...'
    });
});
app.use('/user', user_1.default);
exports.default = app;
