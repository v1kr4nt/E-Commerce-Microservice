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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const PORT = process.env.PORT_ONE || 7070;
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/auth-srv")
    .then(() => {
    console.log("Auth-srv DB connected");
})
    .catch((err) => {
    console.error(err);
});
app.use(express_1.default.json());
app.post("/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.json({ message: "User doesn't exist" });
    }
    else {
        //check if enetered pswd is valid
        if (password !== user.password) {
            return res.json({ message: "Password incorrect" });
        }
        const payload = {
            email,
            name: user.name,
        };
        jsonwebtoken_1.default.sign(payload, "secret", (err, token) => {
            if (err) {
                console.error(err);
            }
            else {
                return res.json({ token });
            }
        });
    }
}));
app.post("/auth/regiter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        return res.json({ message: "User already exists" });
    }
    else {
        const newUser = new User_1.default({
            name,
            email,
            password,
        });
        newUser.save();
        return res.json(newUser);
    }
}));
app.listen(PORT, () => {
    console.log(`Auth-srv at port: ${PORT}`);
});
