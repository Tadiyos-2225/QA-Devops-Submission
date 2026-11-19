# BUG-001: Application fails TypeScript compilation during startup
- **Module:** Users Service
- **Category:** Build / Compilation
- **Severity:** High
- **Priority:** High
- **File:** `src/users/users.service.ts`
- **Location:** Line 38
- **Environment:** dev
- **Status:** Open 

## Description
The application fails TypeScript compilation during startup due to an invalid type assertion in the UsersService duplicate-email error-handling logic.

## Steps to Reproduce
1. Clone the Ella Tech QA Assessment repository.
2. Install dependencies using `npm install`.
3. Configure the required environment variables.
4. Run `npm run start:dev`.
5. Observe the TypeScript compilation output.

## Expected Result
The application should compile successfully and start without TypeScript errors.

## Actual Result
The application reports the following compilation error:

`TS2352: Conversion of type '{ id: number; transactions: never[]; name: string; email: string; }' to type 'User' may be a mistake because neither type sufficiently overlaps with the other.`



# BUG_USER_002: API Accepts Invalid Email Formats

**Severity:** Critical  
**Priority:** High  
**Status:** Open  
**Affected Endpoints:**
- POST /users
- PUT /users/:id

**Related Test Cases:**
- TC_USER_005 – Create user with invalid email
- TC_USER_021 – Update user with invalid email

## Description

The API accepts email addresses that do not follow a valid email format.

During testing, invalid email addresses such as `tadiyos22225gmail.com` and `tadiyos2225gmail.com` were submitted.

Instead of rejecting the requests with HTTP 400 Bad Request, the API successfully created and updated user records.

## Steps to Reproduce

1. Start the User Management API.
2. Send a POST request to create a user.
3. Provide a valid name and an invalid email address.
4. Observe the response.
5. Repeat the test using the PUT endpoint.

## Test Data

```json
{
  "name": "Seyoum",
  "email": "tadiyos22225gmail.com"
}
```

### Expected Result

- API should validate the email format.
- Invalid email addresses should be rejected.
- API should return HTTP 400 Bad Request.
- No user record should be created or updated.

### Actual Result

{
    "statusCode": 201,
    "message": "User created successfully",
    "data": {
        "id": 6,
        "name": "Seyoum",
        "email": "tadiyos22225gmail.com",
        "createdAt": "2026-11-18T16:28:51.129Z",
        "updatedAt": "2026-11-18T16:28:51.129Z"
    }
}


# BUG_USER_003: Unsupported Request Properties Are Not Properly Validated

**Severity:** High  
**Priority:** Medium  
**Status:** Open  
**Affected Endpoints:**
- POST /users
- PUT /users/:id

**Related Test Cases:**
- TC_USER_011 – Create user with extra fields
- TC_USER_022 – Update user with extra fields

## Description

The API does not appear to consistently validate unsupported request properties.

During testing, additional properties were included in the request body, such as `role`.

The API accepted the request instead of rejecting the unsupported property.

The update endpoint also accepted an invalid email value in the same request.

## Steps to Reproduce

1. Send a POST request to create a user.
2. Include valid name and email fields.
3. Add an unsupported property such as `role` and `id` .
4. Observe the API response.
5. Repeat the test with the PUT endpoint.

## Test Data

```json
{
  "name": "Haile",
  "email": "tadiyos2222r5@gmail.com",
  "role": "admin"
}
```

## Expected Result

The API should follow the configured validation policy:

- Reject unsupported properties with HTTP 400, or
- Explicitly remove unsupported properties before processing.

The API must not allow unauthorized properties to modify privileged user attributes.


## Actual Result

The request was accepted, and the API returned a successful response.

The update endpoint also accepted an invalid email value.
{
  "name": "Haile",
  "email": "tadiyos2222r5@gmail.com",
  "role": "admin"
}

### Impact

- Unexpected properties may enter the application.
- Potential mass-assignment vulnerabilities.
- Unauthorized modification of sensitive attributes if such fields are persisted.
- Inconsistent API validation behavior.

### Recommendation

Configure the NestJS global validation pipe:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

---

# BUG_USER_004: API Does Not Trim or Reject Leading and Trailing Whitespace

**Severity:** Medium  
**Priority:** Medium  
**Status:** Open  
**Affected Endpoints:**
- POST /users
- PUT /users/:id

**Related Test Cases:**
- TC_USER_012 – Create user with leading/trailing spaces
- TC_USER_023 – Update user with leading/trailing spaces

## Description

The API accepts user input containing unnecessary leading and trailing whitespace.

During testing, the API successfully stored names and email addresses containing additional spaces.

## Steps to Reproduce

1. Send a POST request to create a user.
2. Include leading and trailing spaces in the name and email fields.
3. Observe the response body.
4. Check the database record.
5. Repeat using the PUT endpoint.

## Test Data

```json
{
  "name": " HAILE  ",
  "email": "TADIYOS2222r5@gmail.com    "
}
```

## Expected Result

The API should consistently:

- Trim leading and trailing whitespace before validation and persistence, or
- Reject whitespace-containing input according to the defined requirements.

## Actual Result

The API returned a successful response and persisted values containing unnecessary whitespace.
{
    "statusCode": 201,
    "message": "User created successfully",
    "data": {
        "id": 13,
        "name": " HAILE  ",
        "email": "TADIYOS2222r5@gmail.com   ",
        "createdAt": "2026-11-18T16:43:13.601Z",
        "updatedAt": "2026-11-18T16:43:13.601Z"
    }
}
# BUG_USER_005: Email Case Normalization Is Not Enforced Consistently

**Severity:** Medium  
**Priority:** Medium  
**Status:** Open  
**Affected Endpoints:**
- POST /users
- PUT /users/:id

**Related Test Cases:**
- TC_USER_013 – Create user with uppercase email
- TC_USER_024 – Update user with uppercase email

## Description

The API does not demonstrate a clearly enforced email case-normalization policy.

During testing, uppercase email addresses were submitted and accepted.

The response data contained email addresses with uppercase characters.

## Steps to Reproduce

1. Create a user using an uppercase email address.
2. Observe the response.
3. Create or update another user using the equivalent lowercase email.
4. Verify whether duplicate detection works consistently.

## Test Data

```json
{
  "name": "HAILE",
  "email": "TADIYOS2222r5@gmail.com"
}
```

## Expected Result

The API should follow a consistent email normalization policy.

For a typical case-insensitive email identity policy:

- Normalize email addresses to lowercase.
- Prevent duplicate accounts with equivalent email addresses.
- Return HTTP 409 Conflict when a duplicate is detected.

## Actual Result

The API accepted uppercase email addresses without demonstrating normalization.

The current test evidence does not establish whether equivalent uppercase and lowercase addresses are treated as duplicates.

{
    "statusCode": 200,
    "message": "User updated successfully",
    "data": {
        "id": 1,
        "name": "TADIYOS",
        "email": "TADIYOS@@@.com",
        "createdAt": "2026-11-17T22:07:14.474Z",
        "updatedAt": "2026-11-18T17:28:47.920Z"
    }
}

# BUG_USER_006: API Accepts Names Exceeding the Supported Maximum Length

**Severity:** High  
**Priority:** Medium  
**Status:** Open  
**Affected Endpoints:**
- POST /users
- PUT /users/:id

**Related Test Cases:**
- TC_USER_014 – Create user with very long name
- TC_USER_025 – Update user with very long name

## Description

The API accepts names that exceed the intended maximum supported length.

During testing, excessively long names were submitted to both POST and PUT endpoints.

The API returned successful responses and persisted the submitted values.

## Steps to Reproduce

1. Prepare a name exceeding the maximum supported length.
2. Send a POST request to create a user.
3. Observe the response.
4. Repeat the request using the PUT endpoint.
5. Verify the stored values in the database.

## Test Data

```json
{
  "name": "HAILE HAILE HAILE HAILE HAILE HAILE HAILE HAILE HAILE HAILE HAILE HAILE HAILE",
  "email": "longname@example.com"
}
```

## Expected Result

- The API should enforce the defined maximum name length.
- Requests exceeding the limit should return HTTP 400 Bad Request.
- No invalid record should be persisted.
- The API should not produce an unhandled database exception.

## Actual Result

Both endpoints returned successful responses and accepted excessively long names.
{
    "statusCode": 201,
    "message": "User created successfully",
    "data": {
        "id": 11,
        "name": " HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE  HAILE ",
        "email": " TADiyos2222r5@gmail.comTADiyos2222r5@gmail.com ",
        "createdAt": "2026-11-18T16:39:54.734Z",
        "updatedAt": "2026-11-18T16:39:54.734Z"
    }
}