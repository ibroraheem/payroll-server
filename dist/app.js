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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Origin',
        'x-access-token',
        'X-Requested-With',
        'Accept',
        'Access-Control-Allow-Headers',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
    ],
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});
app.use('/admin', admin_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, { explorer: true }));
app.use('/swagger-ui', express_1.default.static('node_modules/swagger-ui-dist'));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on port ${port}`);
}));
