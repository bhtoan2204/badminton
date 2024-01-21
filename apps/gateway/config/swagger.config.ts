import { DocumentBuilder } from "@nestjs/swagger";

export const configSwagger = new DocumentBuilder()
    .setTitle('Family Backend API')
    .setDescription('This is the API documentation for the Family Backend API')
    .setVersion('1.0')
    .addBearerAuth(
        {
            description: "access token",
            name: 'Authentication',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header'
        }, 'authentication'
    ).build();

export const customfavIcon = 'https://cdn-icons-png.flaticon.com/512/10095/10095455.png';

export const customJs = [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
];

export const customCssUrl = [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
];