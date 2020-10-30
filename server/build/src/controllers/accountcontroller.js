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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let created_at = Date();
    let hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    console.log('hashedPassword', hashedPassword);
    config_1.pool.query('INSERT INTO user (email, password, created_at) VALUES ($1, $2, $3)', [email, hashedPassword, created_at], (error) => {
        if (error) {
            console.error(error.message);
            res.status(500).json({ status: 'Error', message: error.message });
        }
        const token = jsonwebtoken_1.default.sign({ email }, process.env.APP_SECRET, {
            expiresIn: '24h',
        });
        res.status(200).json({ status: 'Success', message: 'user added', token });
    });
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get user
    // 2. Validate password
    // const isValidPassword = await bcrypt()
    // 3. Sign token and return
});
