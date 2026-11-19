
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const apiErrors = new Rate('api_errors');
const createDuration = new Trend('create_user_duration');
const listDuration = new Trend('get_users_duration');
const detailDuration = new Trend('get_user_duration');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '2m', target: 25 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
    api_errors: ['rate<0.01'],
    create_user_duration: ['p(95)<1000'],
    get_users_duration: ['p(95)<1000'],
    get_user_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const USERS_URL = `${BASE_URL}/users`;

function getUserId(response) {
  try {
    const body = response.json();

    // Support common API response structures
    return body?.id
      ?? body?.data?.id
      ?? body?.user?.id
      ?? null;
  } catch (_) {
    return null;
  }
}

export default function () {
  const uniqueId = `${__VU}_${__ITER}_${Date.now()}`;

  const payload = JSON.stringify({
    name: `Performance User ${uniqueId}`,
    email: `performance_${uniqueId}@example.com`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 1. CREATE USER
  const createResponse = http.post(
    USERS_URL,
    payload,
    params
  );

  createDuration.add(createResponse.timings.duration);

  const createPassed = check(createResponse, {
    'POST /users returns 201': (r) => r.status === 201,
  });

  let userId = getUserId(createResponse);

  const idFound = check(userId, {
    'POST response contains user ID': (id) => id !== null,
  });

  apiErrors.add(!createPassed || !idFound);

  // 2. GET USER BY ID
  if (userId !== null) {
    const detailResponse = http.get(
      `${USERS_URL}/${userId}`
    );

    detailDuration.add(detailResponse.timings.duration);

    const detailPassed = check(detailResponse, {
      'GET /users/:id returns 200': (r) => r.status === 200,
    });

    apiErrors.add(!detailPassed);
  }

  // 3. GET USERS
  const listResponse = http.get(USERS_URL);

  listDuration.add(listResponse.timings.duration);

  const listPassed = check(listResponse, {
    'GET /users returns 200': (r) => r.status === 200,
  });

  apiErrors.add(!listPassed);

  sleep(1);
}
