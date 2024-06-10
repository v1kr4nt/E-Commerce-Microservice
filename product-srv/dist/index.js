"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = process.env.PORT_TWO || 8080;
app.use(express_1.default.json());
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/product-srv")
    .then(() => {
    console.log("product-srv DB connected");
})
    .catch((err) => {
    console.error(err);
});
app.listen(PORT, () => {
    console.log(`Product-srv at port: ${PORT}`);
});
