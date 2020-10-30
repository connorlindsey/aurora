"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === 'production';
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default({
    origin: isProduction ? 'https://twelvemonth.vercel.app' : '*',
}));
app.get('/', (req, res) => res.send('twelvemonth API'));
// Early Access
const getEarlyAccess = (req, res) => {
    console.info('Get early access');
    config_1.pool.query('SELECT * FROM earlyaccess', (error, results) => {
        if (error) {
            console.error(error.message);
            res.status(500).json({ status: 'Error', message: error.message });
        }
        res.status(200).json(results.rows);
    });
};
const addEarlyAccess = (req, res) => {
    console.info('Add early access');
    const { email, name } = req.body;
    console.log('email', email);
    console.log('name', name);
    config_1.pool.query('INSERT INTO earlyaccess (email, name) VALUES ($1, $2)', [email, name], (error) => {
        if (error) {
            console.error(error.message);
            res.status(500).json({ status: 'Error', message: error.message });
        }
        res.status(200).json({ status: 'Success', message: 'Subscriber added' });
    });
};
app.route('/earlyaccess').get(getEarlyAccess).post(addEarlyAccess);
const aims = [
    { id: 1, name: 'Stretch' },
    { id: 2, name: 'Read' },
    { id: 3, name: 'Journal' },
];
app.get('/aims', (req, res) => res.json(aims));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
process.on('uncaughtException', function (error) {
    console.log(error.stack);
});
