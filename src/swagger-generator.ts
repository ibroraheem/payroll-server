// swagger-generator.ts
import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger-output.json';

const generateSwagger = async () => {
    const endpointsFiles = ['./routes/*.ts']; // Adjust the path based on your project structure
    const doc = await swaggerAutogen()(outputFile, endpointsFiles);

    console.log('Swagger documentation generated successfully!');
};

generateSwagger();

export default generateSwagger;
