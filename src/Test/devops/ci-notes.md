# CI/CD Pipeline Notes

## 1. Overview

This project uses **GitHub Actions** to implement Continuous Integration (CI) for the NestJS application.

The pipeline automatically validates code changes whenever a developer pushes code to the repository or creates a pull request.

The main objective is to maintain code quality, detect issues early, and ensure that changes do not break the application.

## 2. CI/CD Technology Stack

| Technology | Purpose |
|---|---|
| GitHub Actions | CI/CD automation |
| Node.js 22 | JavaScript runtime |
| npm | Dependency management |
| ESLint | Code quality and static analysis |
| Prettier | Code formatting |
| NestJS CLI | Application build |
| Jest | Unit and E2E testing |

## 3. Workflow Location

The GitHub Actions workflow is located at:

```text
.github/
└── workflows/
    └── ci.yml
```

## 4. Pipeline Triggers

The pipeline executes automatically on:

- **Push:** Whenever code is pushed to the repository.
- **Pull Request:** Whenever a pull request is created or updated.

This ensures that changes are validated before being merged into the main branch.

## 5. CI Pipeline Stages

The pipeline contains the following stages:

| Stage | Command / Action | Description |
|---|---|---|
| Checkout | `actions/checkout` | Retrieves the repository source code. |
| Setup | `actions/setup-node` | Configures the Node.js environment. |
| Install | `npm ci` | Installs dependencies using package-lock.json. |
| Lint | `npm run lint:check` | Checks TypeScript code against ESLint rules. |
| Build | `npm run build` | Compiles the NestJS application. |
| Unit Tests | `npm test -- --runInBand` | Executes Jest unit tests. |

## 6. Failure Handling

The workflow uses GitHub Actions' default failure-handling behavior.

If any pipeline stage fails:

- Subsequent steps are skipped by default.
- The workflow is marked as failed.
- GitHub displays the failed job and relevant error logs.
- Developers can investigate and fix the issue before merging changes.

No failure is intentionally ignored.

## 7. Running CI Checks Locally

Developers can execute the same validation stages locally before pushing changes.

```bash
# Install dependencies
npm ci

# Run ESLint
npm run lint:check

# Build the application
npm run build

# Run unit tests
npm test -- --runInBand

# Run E2E tests separately
npm run test:e2e
```

## 8. Continuous Deployment (Future Improvements)

The current implementation focuses on Continuous Integration. It can be extended to support Continuous Deployment through the following improvements:

1. **Dockerization:** Create a Dockerfile to package the NestJS application.
2. **Container Registry:** Push successfully built Docker images to GitHub Container Registry (GHCR).
3. **Staging Deployment:** Automatically deploy validated changes to a staging environment.
4. **Smoke Testing:** Execute post-deployment tests to verify application health and critical functionality.
5. **Production Deployment:** Deploy approved releases to production.
6. **Secrets Management:** Store deployment credentials, database passwords, and API keys securely using GitHub Actions Secrets.
7. **Rollback Strategy:** Maintain previous stable versions to enable recovery if a deployment fails.

### Proposed Future Deployment Flow

```text
Developer Push / Pull Request
             |
             v
       GitHub Actions
             |
             v
     Install Dependencies
             |
             v
        Run ESLint
             |
             v
      Build Application
             |
             v
        Run Tests
             |
             v
       All Checks Pass?
             |
             v
       Build Docker Image
             |
             v
     Push Image to GHCR
             |
             v
      Deploy to Staging
             |
             v
        Smoke Testing
             |
             v
    Deploy to Production
```

## 9. Conclusion

The GitHub Actions pipeline provides an automated quality gate for the NestJS application. By running linting, building, and automated tests on every push and pull request, it helps identify defects early and improves the reliability of software changes.

The proposed deployment improvements provide a foundation for evolving the current CI implementation into a complete CI/CD solution.
