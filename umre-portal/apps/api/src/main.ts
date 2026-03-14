import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const helmet = require('helmet');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // HTTP güvenlik başlıkları (XSS, Clickjacking, sniffing önleme)
    // crossOriginResourcePolicy kapalı — api.kasriroyal.com/uploads resimleri cross-origin yüklenebilsin
    app.use(helmet({
        crossOriginResourcePolicy: false,
    }));

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://admin.kasriroyal.com',
            'https://kasriroyal.com',
            'https://www.kasriroyal.com'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const config = new DocumentBuilder()
        .setTitle('Umre Portal API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.API_PORT || 4000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
