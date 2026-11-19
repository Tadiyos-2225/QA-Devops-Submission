import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import type { Server } from 'node:http';
import { AppModule } from '../../../app.module';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const getResponseBody = <T>(response: { body: unknown }): ApiResponse<T> => {
  return response.body as ApiResponse<T>;
};

describe('Users API (E2E)', () => {
  let app: INestApplication;
  let server: Server;
  let seq = 0;

  const baseUrl = '/users';

  const nextToken = () => `${Date.now()}_${++seq}`;
  const uniqueEmail = () => `user_${nextToken()}@example.com`;

  const validUser = (
    overrides: Partial<{ name: string; email: string }> = {},
  ) => ({
    name: 'Tadiyos',
    email: uniqueEmail(),
    ...overrides,
  });

  const createUser = async (
    overrides: Partial<{ name: string; email: string }> = {},
  ): Promise<User> => {
    const response = await request(server)
      .post(baseUrl)
      .send(validUser(overrides))
      .expect(201);

    return getResponseBody<User>(response).data;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    // TC_USER_001
    it('should create a user with valid data', async () => {
      const payload = validUser();

      const response = await request(server)
        .post(baseUrl)
        .send(payload)
        .expect(201);

      const body = getResponseBody<User>(response);

      expect(body.statusCode).toBe(201);
      expect(body.message).toBe('User created successfully');
      expect(body.data).toMatchObject({
        name: payload.name,
        email: payload.email.toLowerCase(),
      });
      expect(body.data.id).toBeDefined();
      expect(body.data.createdAt).toBeDefined();
      expect(body.data.updatedAt).toBeDefined();
    });

    // TC_USER_002
    it('should reject a duplicate email with 409 Conflict', async () => {
      const payload = validUser();

      await request(server).post(baseUrl).send(payload).expect(201);

      const response = await request(server)
        .post(baseUrl)
        .send(payload)
        .expect(409);

      const body = getResponseBody<unknown>(response);

      expect(body.statusCode).toBe(409);
      expect(body.message).toBe('User already exists');
    });

    // TC_USER_003
    it('should reject a request missing name', async () => {
      const response = await request(server)
        .post(baseUrl)
        .send({ email: uniqueEmail() })
        .expect(400);

      expect(getResponseBody<unknown>(response).statusCode).toBe(400);
    });

    // TC_USER_004
    it('should reject a request missing email', async () => {
      const response = await request(server)
        .post(baseUrl)
        .send({ name: 'Tadiyos' })
        .expect(400);

      expect(getResponseBody<unknown>(response).statusCode).toBe(400);
    });

    // TC_USER_005
    it('should reject an invalid email address', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: 'Tadiyos',
          email: 'johnexample.com',
        })
        .expect(400);
    });

    // TC_USER_006
    it('should reject an empty name', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: '',
          email: uniqueEmail(),
        })
        .expect(400);
    });

    // TC_USER_007
    it('should reject an empty email', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: 'Tadiyos',
          email: '',
        })
        .expect(400);
    });

    // TC_USER_008
    it('should reject a null name', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: null,
          email: uniqueEmail(),
        })
        .expect(400);
    });

    // TC_USER_009
    it('should reject a null email', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: 'Tadiyos',
          email: null,
        })
        .expect(400);
    });

    // TC_USER_010
    it('should reject a missing request body', async () => {
      await request(server).post(baseUrl).expect(400);
    });

    // TC_USER_011
    it('should reject unsupported extra properties', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: 'Tadiyos',
          email: uniqueEmail(),
          role: 'admin',
        })
        .expect(400);
    });

    // TC_USER_012
    it('should reject whitespace-only name and email', async () => {
      await request(server)
        .post(baseUrl)
        .send({
          name: '   ',
          email: '   ',
        })
        .expect(400);
    });

    // TC_USER_013
    it('should normalize uppercase email to lowercase on create', async () => {
      const token = nextToken();
      const uppercaseEmail = `UPPER_${token}@EXAMPLE.COM`;

      const response = await request(server)
        .post(baseUrl)
        .send({
          name: 'Uppercase User',
          email: uppercaseEmail,
        })
        .expect(201);

      const body = getResponseBody<User>(response);

      expect(body.data.email).toBe(uppercaseEmail.toLowerCase());
    });

    // TC_USER_014
    it('should reject a name exceeding maximum allowed length', async () => {
      const response = await request(server)
        .post(baseUrl)
        .send({
          name: 'A'.repeat(10000),
          email: uniqueEmail(),
        })
        .expect(400);

      expect(getResponseBody<unknown>(response).statusCode).toBe(400);
    });

    // TC_USER_015
    it('should support valid special and Unicode characters in names', async () => {
      const payload = validUser({ name: "José O'Neil-Test" });

      const response = await request(server)
        .post(baseUrl)
        .send(payload)
        .expect(201);

      const body = getResponseBody<User>(response);

      expect(body.data.name).toBe(payload.name);
    });
  });

  describe('GET /users/:id', () => {
    // TC_USER_016
    it('should retrieve an existing user by ID', async () => {
      const created = await createUser();

      const response = await request(server)
        .get(`${baseUrl}/${created.id}`)
        .expect(200);

      const body = getResponseBody<User>(response);

      expect(body.data.id).toBe(created.id);
      expect(body.data.email).toBe(created.email);
    });

    // TC_USER_017
    it('should return 404 for a nonexistent user', async () => {
      const response = await request(server)
        .get(`${baseUrl}/99999999`)
        .expect(404);

      expect(getResponseBody<unknown>(response).statusCode).toBe(404);
    });

    // TC_USER_018
    it('should reject a non-numeric user ID with 400', async () => {
      const response = await request(server).get(`${baseUrl}/abc`).expect(400);

      expect(getResponseBody<unknown>(response).statusCode).toBe(400);
    });
  });

  describe('PUT /users/:id', () => {
    // TC_USER_019
    it('should update an existing user', async () => {
      const created = await createUser();

      const response = await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({ name: 'Jane Doe' })
        .expect(200);

      const body = getResponseBody<User>(response);

      expect(body.data.id).toBe(created.id);
      expect(body.data.name).toBe('Jane Doe');
    });

    // TC_USER_020
    it('should reject updating to an email already assigned to another user', async () => {
      const first = await createUser();
      const second = await createUser();

      const response = await request(server)
        .put(`${baseUrl}/${first.id}`)
        .send({ email: second.email })
        .expect(409);

      expect(getResponseBody<unknown>(response).statusCode).toBe(409);
    });

    // TC_USER_021
    it('should reject an invalid email during update', async () => {
      const created = await createUser();

      await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({ email: 'johnexample.com' })
        .expect(400);
    });

    // TC_USER_022
    it('should reject unsupported extra properties during update', async () => {
      const created = await createUser();

      await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({
          name: 'Updated Name',
          role: 'admin',
        })
        .expect(400);
    });

    // TC_USER_023
    it('should reject whitespace-only name during update', async () => {
      const created = await createUser();

      await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({ name: '   ' })
        .expect(400);
    });

    // TC_USER_024
    it('should normalize uppercase email to lowercase on update', async () => {
      const created = await createUser();
      const updatedEmail = `UPPER_UPDATE_${nextToken()}@EXAMPLE.COM`;

      const response = await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({ email: updatedEmail })
        .expect(200);

      const body = getResponseBody<User>(response);

      expect(body.data.email).toBe(updatedEmail.toLowerCase());
    });

    // TC_USER_025
    it('should reject a name exceeding maximum allowed length on update', async () => {
      const created = await createUser();

      const response = await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({ name: 'A'.repeat(10000) })
        .expect(400);

      expect(getResponseBody<unknown>(response).statusCode).toBe(400);
    });

    // TC_USER_026
    it('should support valid special characters in an updated name', async () => {
      const created = await createUser();
      const updatedName = "José O'Neil-Test";

      const response = await request(server)
        .put(`${baseUrl}/${created.id}`)
        .send({ name: updatedName })
        .expect(200);

      const body = getResponseBody<User>(response);

      expect(body.data.name).toBe(updatedName);
    });
  });

  describe('GET /users', () => {
    // TC_USER_027
    it('should retrieve users as a collection', async () => {
      await createUser();

      const response = await request(server).get(baseUrl).expect(200);

      const body = getResponseBody<User[]>(response);

      expect(body.statusCode).toBe(200);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });
});
