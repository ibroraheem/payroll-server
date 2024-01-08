// generate-swagger.ts
import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/*.ts']; // Adjust the path based on your project structure

const generateSwagger = async () => {
    const doc = await swaggerAutogen()(outputFile, endpointsFiles);
    console.log('Swagger documentation generated successfully!');
};

generateSwagger();

export default generateSwagger;
