import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3334);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3334')
  });

  afterAll(() => {
    app.close()
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'email@gmail.com',
      password: '123',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
          // .inspect()
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            email: dto.email
          })
          .expectStatus(400)
          // .inspect()
      });

      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          )
          .expectStatus(400)
          // .inspect()
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody(dto)
          .expectStatus(201)
          // .inspect()
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
          // .inspect()
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
            email: dto.email
          })
          .expectStatus(400)
          // .inspect()
      });

      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          )
          .expectStatus(400)
          // .inspect()
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          // .inspect()
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`
          })
          .inspect()
          .expectStatus(200);
      })
    });

    describe('Edit user', () => {

    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {

    });

    describe('Get bookmarks', () => {

    });

    describe('Get bookmark by id', () => {

    });

    describe('Edit bookmark by id', () => {

    });

    describe('Delete bookmark by id', () => {

    });
  });
});
