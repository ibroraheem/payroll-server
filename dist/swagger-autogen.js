"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputFile = void 0;
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const path_1 = __importDefault(require("path"));
const swaggerAutogenInstance = (0, swagger_autogen_1.default)();
exports.outputFile = path_1.default.join(__dirname, 'swagger_output.json');
const endpointsFiles = [path_1.default.join(__dirname, './app.ts'), path_1.default.join(__dirname, './routes/admin.ts')];
swaggerAutogenInstance(exports.outputFile, endpointsFiles);
