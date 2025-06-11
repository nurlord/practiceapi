import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis/redis.service';
import { RedisStore } from 'connect-redis';
import { ms, StringValue } from './utils/ms.util';
import { parseBoolean } from './utils/parse-boolean.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    // origin: [process.env.CLIENT_URL],
    origin: (origin, callback) => {
      callback(null, true); // allow all origins dynamically
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const config = app.get(ConfigService);
  const redis = app.get(RedisService);
  const redisStore = new RedisStore({
    client: redis,
    prefix: config.getOrThrow<string>('SESSION_FOLDER'),
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        // domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: redisStore,
    }),
  );
  const swaggerConfig = new DocumentBuilder().setTitle('ApiDocs').build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(5000);
}
bootstrap();
