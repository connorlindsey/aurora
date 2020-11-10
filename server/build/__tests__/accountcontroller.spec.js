"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accountcontroller_1 = require("../src/controllers/accountcontroller");
describe('Sign up', () => {
    it('should register a new user', () => {
        let req = {};
        let res = {};
        accountcontroller_1.register(req, res);
    });
});
