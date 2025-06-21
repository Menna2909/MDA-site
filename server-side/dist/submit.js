"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submitted_IPs = [];
const app = (0, express_1.default)();
const PORT = 3000;
const checkIP = (ip) => {
    return submitted_IPs.includes(ip);
};
app.post('/submit', (req, res) => {
    if (checkIP(req.ip)) {
        res.send(false); //meaning the request is invalid cuz the ip already exist 
        return;
    }
    else {
        submitted_IPs.push(req.ip);
        res.send(true); //meaning the user can go on 
        return;
    }
});
app.listen(PORT, () => {
    console.log(`server is listening on port : http://localhost:${PORT}`);
});
