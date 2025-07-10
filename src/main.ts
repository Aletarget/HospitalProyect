import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      
    }) 
  );
  app.enableCors({
    origin: ['https://front-hospital-production.up.railway.app'], // permite peticiones desde React
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
