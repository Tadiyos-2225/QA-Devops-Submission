# Environment Configuration

## 1. Overview

The application uses environment variables to manage configuration across development, staging, and testing environments.

The `.env.example` file provides a template containing the required environment variable names and example values. Each environment uses its own configuration to separate database connections, application ports, and credentials.

Environment-specific configuration prevents developers and automated tests from accidentally using staging or production resources.

## 2. Required Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NODE_ENV` | Identifies the current application environment | Yes |
| `PORT` | Port on which the NestJS application listens | Yes |
| `DB_HOST` | Database server hostname or service name | Yes |
| `DB_PORT` | PostgreSQL database port | Yes |
| `DB_USERNAME` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_DATABASE` | Database name | Yes |

## 3. Environment-Specific Configuration

### 3.1 Development Environment

Purpose: Local application development and debugging.

Example configuration:

```env
NODE_ENV=development
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
DB_DATABASE=QA-Assessment
```

Characteristics:

- Uses a locally running PostgreSQL instance or a Docker database.
- Uses development-specific database credentials.
- Enables local debugging and development workflows.
- Allows developers to modify and reset development data.
- When the API runs inside Docker Compose, `DB_HOST` must be `db`.

### 3.2 Staging Environment

Purpose: Validate the application in an environment that closely resembles production before release.

Example configuration:

```env
NODE_ENV=staging
PORT=4000

DB_HOST=staging-database-host
DB_PORT=5432
DB_USERNAME=staging_user
DB_PASSWORD=provided_by_secret_manager
DB_DATABASE=QA-Assessment-Staging
```

Characteristics:

- Uses a separate staging database and credentials.
- Uses environment-specific infrastructure and hostnames.
- Credentials are stored in GitHub Actions Secrets or another secure secret manager.
- Supports integration, regression, acceptance, and pre-release testing.
- Should resemble production configuration as closely as possible.
- Must not use development or production database credentials.

### 3.3 Testing Environment

Purpose: Execute automated unit, integration, and end-to-end tests.

Example configuration:

```env
NODE_ENV=test
PORT=4001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=test_user
DB_PASSWORD=test_password
DB_DATABASE=QA-Assessment-Test
```

Characteristics:

- Uses an isolated test database.
- Uses dedicated test credentials.
- Prevents automated tests from modifying development or staging data.
- Supports repeatable test execution.
- Test data can be created, reset, and cleaned up during test execution.
- CI pipelines should fail if required test configuration is missing or tests fail.

## 4. Differences Between Environments

| Configuration | Development | Staging | Testing |
|---|---|---|---|
| Purpose | Development and debugging | Pre-production validation | Automated test execution |
| Database | Local development DB | Dedicated staging DB | Isolated test DB |
| Credentials | Local credentials | Securely managed secrets | Test-only credentials |
| Data | Developer data | Controlled staging data | Disposable test data |
| Application port | 4000 | 4000 | 4001 |
| Debugging | Enabled as needed | Restricted | Test diagnostics |
| Deployment | Local machine or Docker | Staging infrastructure | CI pipeline or local test runner |

## 5. Security and Configuration Management

The following practices should be followed:

1. Never commit actual `.env` files or database passwords to GitHub.
2. Commit `.env.example` containing variable names and safe placeholder values.
3. Add `.env`, `.env.*`, and other sensitive environment files to `.gitignore`, while explicitly allowing `.env.example`.
4. Store staging credentials in GitHub Actions Secrets or a secure secret manager.
5. Use separate database accounts and databases for each environment.
6. Avoid using real customer data in testing environments.
7. Validate required environment variables before starting the application.
8. Rotate credentials if they are accidentally exposed.

## 6. Example .env.example

```env
# Application Configuration
NODE_ENV=development
PORT=4000

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_database_username
DB_PASSWORD=replace_with_local_password
DB_DATABASE=QA-Assessment
```

This file is a template only. Developers should copy it into their local environment configuration and provide their own values.

## 7. Conclusion

Environment-specific configuration provides isolation, security, and consistency throughout the software development lifecycle.

Development supports local implementation, staging supports pre-production validation, and testing provides an isolated environment for automated quality assurance.

Sensitive credentials are managed outside source control, while `.env.example` documents the configuration required to run the application.
