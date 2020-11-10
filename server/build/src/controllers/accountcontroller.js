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
exports.validateSession = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    let created_at = Date.now();
    try {
        let hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        config_1.pool.query('INSERT INTO account (email, password, created_at, role) VALUES ($1, $2, to_timestamp($3), $4)', [email, hashedPassword, created_at, 'DEFAULT'], (e) => {
            if (e) {
                console.error(e.message);
                if (e.message.includes('duplicate key value')) {
                    return res
                        .status(500)
                        .json({ status: 'Error', message: 'Email address already in use.' });
                }
                return res.status(500).json({ status: 'Error', message: e.message });
            }
            const token = jsonwebtoken_1.default.sign({ email }, process.env.APP_SECRET, {
                expiresIn: '24h',
            });
            storeToken(email, token);
            return res.status(200).json({ status: 'Success', message: 'user added', token });
        });
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.status(500).json({ status: 'Error', message: e.message });
        }
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // 1. Get user
        const { rows } = yield config_1.pool.query('SELECT * FROM account WHERE email = $1', [email]);
        if (rows.length < 1) {
            return res.status(400).json({ status: 'Error', message: 'User not found' });
        }
        // 2. Validate password
        const isValidPassword = yield bcryptjs_1.default.compare(password, rows[0].password);
        if (!isValidPassword) {
            console.log('Incorrect password');
            return res.status(400).json({ status: 'Error', message: 'Incorrect password' });
        }
        // 3. Sign token and return
        const token = jsonwebtoken_1.default.sign({ email }, process.env.APP_SECRET, {
            expiresIn: '24h',
        });
        storeToken(email, token);
        return res.status(200).json({ status: 'Success', message: 'user added', token });
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.status(500).json({ status: 'Error', message: e.message });
        }
    }
});
exports.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield config_1.pool.query('DELETE FROM session WHERE token = $1', [req.body.token]);
        return res.status(200).send();
    }
    catch (e) {
        return res.status(500).send();
    }
});
exports.validateSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.body;
    try {
        const { rows } = yield config_1.pool.query(`
        SELECT s.expires_at, a.role FROM session AS s 
        LEFT JOIN account AS a ON s.email = a.email
        WHERE s.token = $1 AND s.email = $2
      `, [token, email]);
        if (rows.length === 1 && rows[0].expires_at > Date.now()) {
            return res
                .status(200)
                .json({ status: 'Success', user: { role: rows[0].role, authenticated: true } });
        }
        return res.status(400).json({ status: 'Error', message: 'Invalid session' });
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.status(500).json({ status: 'Error', message: e.message });
        }
    }
});
const storeToken = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expires_at = Date.now() - 24 * 60 * 60 * 1000;
        yield config_1.pool.query('INSERT INTO session (email, token, expires_at) VALUES ($1, $2, to_timestamp($3))', [email, token, expires_at]);
    }
    catch (e) {
        throw e;
    }
});
