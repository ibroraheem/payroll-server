// swagger-autogen-script.ts

import swaggerAutogen from 'swagger-autogen';
import path from 'path';

const swaggerAutogenInstance = swaggerAutogen();

export const outputFile = path.join(__dirname, 'swagger_output.json');
const endpointsFiles = [path.join(__dirname, './app.ts'), path.join(__dirname, './routes/admin.ts',)];

swaggerAutogenInstance(outputFile, endpointsFiles);
