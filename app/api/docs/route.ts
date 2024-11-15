import swaggerJsdoc from 'swagger-jsdoc';
import { NextResponse } from 'next/server';
//@ts-ignore
import { SwaggerOptions } from 'swagger-jsdoc';

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api Dcoumentation for PitStop',
      version: '1.0.0',
      description: 'Documentation is in progress',
    },
    servers: [
      {
        url: 'https://spyne--assignment.vercel.app/',
      },
    ],
  },
  apis: ['./app/api/**/*.ts'],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
