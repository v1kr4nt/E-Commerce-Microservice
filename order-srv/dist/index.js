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
const amqplib_1 = __importDefault(require("amqplib"));
const Order_1 = __importDefault(require("./models/Order"));
const app = (0, express_1.default)();
const PORT = process.env.PORT_TWO || 9090;
app.use(express_1.default.json());
var channel, connection;
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/order-srv")
    .then(() => {
    console.log("order-srv DB connected");
})
    .catch((err) => {
    console.error(err);
});
function connectmq() {
    return __awaiter(this, void 0, void 0, function* () {
        const amqpServer = "amqp://localhost:5672";
        connection = yield amqplib_1.default.connect(amqpServer);
        channel = yield connection.createChannel();
        yield channel.assertQueue("ORDER");
    });
}
function createOrder(products, userEmail) {
    let total_price = 0;
    for (let i = 0; i < products.length; i++) {
        total_price += products[i].price;
    }
    const newOrder = new Order_1.default({
        products,
        user: userEmail,
        total_price,
    });
    newOrder.save();
    return newOrder;
}
connectmq().then(() => {
    channel.consume("ORDER", (data) => {
        const { products, userEmail } = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
    });
});
app.listen(PORT, () => {
    console.log(`Order-srv at port: ${PORT}`);
});
