import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { createFieldValidationException } from './common/exceptions/field-validation.exception';

function buildCorsOrigins(): string[] {
  const isProd = process.env.NODE_ENV === 'production';
  const rawEnvOrigins = [process.env.CORS_ORIGINS, process.env.FRONTEND_URL]
    .filter((val): val is string => Boolean(val && val.trim()))
    .flatMap((val) => val.split(','))
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const devOrigins = isProd
    ? []
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ];

  return Array.from(new Set([...rawEnvOrigins, ...devOrigins]));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.enableShutdownHooks();
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: createFieldValidationException,
    }),
  );

  const allowedOrigins = buildCorsOrigins();
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
