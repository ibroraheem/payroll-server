import swaggerAutogen from 'swagger-autogen';
import path from 'path';

const swaggerAutogenInstance = swaggerAutogen();

export const outputFile = path.join(__dirname, 'swagger_output.json');
const endpointsFiles = [path.join(__dirname, './app.ts')]; // Update the file extension if necessary

swaggerAutogenInstance(outputFile, endpointsFiles);
