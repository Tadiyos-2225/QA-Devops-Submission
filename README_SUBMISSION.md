# Ella Tech – QA & DevOps Assessment

## 1. Introduction

This submission demonstrates my approach to Software Quality Assurance (QA) and DevOps engineering through the assessment application.

The objective was to evaluate application quality, demonstrate practical testing and automation skills, identify potential issues, and establish a foundation for a reliable development and deployment workflow.

The assessment covers QA strategy, API automation, defect reporting, performance testing, code review, CI/CD, Docker containerization, environment configuration, health monitoring, deployment documentation, and a proposed cloud deployment architecture.

## 2. Overall Approach

I approached the assessment by combining software testing practices with DevOps implementation.

My main focus was to demonstrate how quality can be integrated throughout the software development lifecycle, from understanding application requirements and validating API behavior to automating checks and preparing the application for deployment.

The work was organized around the following areas:

### 2.1 Quality Assurance and Testing

- Developed a QA test strategy covering functional, negative, boundary, and integration testing.
- Designed and implemented API automation tests.
- Focused on request validation, response status codes, response structure, and data consistency.
- Identified and documented defects with their expected and actual results.
- Evaluated API performance under load using k6.
- Prepared code review guidelines to improve code quality, maintainability, and reliability.

### 2.2 DevOps and Deployment

- Prepared a GitHub Actions CI pipeline to automate linting, application building, and unit testing.
- Reviewed and improved Dockerfile and Docker Compose configurations.
- Configured PostgreSQL as the application's database service.
- Documented environment-specific configuration for development, staging, and testing.
- Worked on application health monitoring through a health-check endpoint.
- Prepared a deployment runbook covering deployment, verification, troubleshooting, and rollback.
- Proposed an AWS cloud deployment architecture using ECS Fargate, ECR, RDS, Application Load Balancer, Secrets Manager, and CloudWatch.

## 3. Scope, Prioritization, and Time Management

Given the limited time available for the assessment, I prioritized the **Users module and its underlying database table** as the primary focus of my detailed QA implementation.

Rather than distributing the available time equally across Users, Products, and Transactions, I concentrated on the Users module to demonstrate a deeper and more structured testing approach.

My work on the Users module included:

- Understanding the Users API and its underlying data model.
- Designing positive, negative, and boundary test scenarios.
- Implementing automated API tests for critical user operations.
- Evaluating API response times and behavior under load.
- Identifying and documenting functional and technical defects.
- Reviewing request validation, error handling, and database interactions.

The Products and Transactions modules were considered as part of the overall application architecture, but they did not receive the same depth of test implementation.

This was a conscious time-management decision intended to demonstrate test quality, technical depth, and a maintainable automation approach within the available assessment timeframe.

I recognize that a complete QA implementation should extend the same level of coverage to all application modules. Expanding automated coverage for Products and Transactions is therefore an important next step.

## 4. Performance Testing

Performance testing was conducted using k6 to evaluate API behavior under load.

The testing focused on:

- API response time.
- 95th percentile response time (p95).
- Request failure rate.
- API behavior under concurrent requests.
- Performance thresholds.

The performance results highlighted response-time concerns in some user operations, even though the API error rate remained within the defined threshold.

These findings provide a baseline for further performance optimization and investigation.

The results should be interpreted in the context of the local test environment and should not be considered a production capacity assessment.

## 5. Defect Reporting and Code Quality

Defects identified during testing were documented with relevant information to support investigation and resolution.

The bug reports focused on:

- Clear defect descriptions.
- Preconditions and reproduction steps.
- Expected versus actual results.
- Severity and priority.
- Relevant API responses and observations.
- Recommended investigation areas.

Code review guidelines were also prepared to encourage consistent coding practices, appropriate error handling, input validation, maintainability, and reliable database interactions.

## 6. DevOps Implementation

### 6.1 CI Pipeline

A GitHub Actions workflow was prepared to automate the following checks:

1. Install project dependencies.
2. Run ESLint.
3. Build the application.
4. Execute unit tests.

The pipeline is designed to run on pushes and pull requests. A failure in any required step causes the workflow to fail.

### 6.2 Docker Containerization

Docker and Docker Compose were used to containerize the application and PostgreSQL database.

The implementation covers:

- Application image building.
- PostgreSQL container configuration.
- Database persistence using Docker volumes.
- Environment variable injection.
- Database health checks.
- Application-to-database service communication.

The application and database containers were started and inspected locally.

### 6.3 Environment Configuration

Environment configuration was documented for:

- Development.
- Staging.
- Testing.

The documentation explains differences in database hosts, database names, credentials, and runtime configuration.

Sensitive values are intended to be supplied through environment variables or secure secret-management services rather than committed to source control or embedded in Docker images.

### 6.4 Health Checks and Monitoring

An application health endpoint was implemented to check application availability and database connectivity.

The intended endpoint is:

`GET /health`

The response reports the application status, database connection status, and timestamp.

Additional monitoring and troubleshooting commands were documented using Docker Compose logs, container status, and resource monitoring.

### 6.5 Deployment Runbook

A deployment runbook was prepared to document:

- Prerequisites.
- Environment configuration.
- Application build and deployment.
- Deployment verification.
- Health checks and smoke testing.
- Log inspection.
- Troubleshooting.
- Rollback procedures.
- Database backup considerations.

### 6.6 Cloud Deployment Plan

As a bonus, I prepared a proposed AWS deployment architecture using:

- **Amazon ECR:** Container image storage.
- **Amazon ECS Fargate:** Container orchestration and application hosting.
- **Amazon RDS PostgreSQL:** Managed relational database.
- **Application Load Balancer:** Application traffic distribution.
- **AWS Secrets Manager:** Secure credential management.
- **Amazon CloudWatch:** Logs, metrics, and monitoring.

The proposed deployment approach includes automated image publishing and deployment through an extended GitHub Actions workflow.

This cloud architecture is a deployment proposal and was not presented as an already completed production deployment.

## 7. Tools and Technologies

| Area | Tools and Technologies |
|---|---|
| Backend | NestJS, Node.js, TypeScript |
| Database | PostgreSQL, TypeORM |
| API Testing | API automation framework, HTTP requests |
| Performance Testing | k6 |
| Code Quality | ESLint, Prettier |
| CI/CD | GitHub Actions |
| Containerization | Docker, Docker Compose |
| Version Control | Git, GitHub |
| Cloud Architecture | AWS ECS, ECR, RDS, ALB, Secrets Manager, CloudWatch |
| Documentation | Markdown |
| AI Assistance | AI-assisted documentation and technical presentation |

## 8. AI-Assisted Documentation and Data Presentation

I used AI as a supporting tool during the assessment, primarily to improve documentation quality, organize technical information, and present test findings and implementation details more clearly.

AI assistance was useful for:

- Structuring and improving Markdown documentation.
- Organizing test results and performance observations.
- Improving the presentation and readability of technical findings.
- Preparing clear summaries, tables, and data representations.
- Reviewing troubleshooting explanations and implementation documentation.

The purpose of using AI was to improve the clarity, consistency, and presentation of the assessment deliverables.

AI was used as an assistance tool rather than a replacement for QA engineering judgment. Technical decisions, implementation work, test execution, validation, and final conclusions remain subject to my review and verification.

## 9. How to Review and Verify This Submission

The complete source code, test implementation, configuration files, and documentation are available in my GitHub repository.

**GitHub Repository:**  
https://github.com/Tadiyos-2225/QA-Devops-Submission

The following steps can be used to review the submission.

### 9.1 Review the Source Code and Documentation

1. Open the GitHub repository.
2. Review the project structure and implementation.
3. Navigate to the `qa/` directory to inspect the test strategy, automation framework, bug reports, performance test, and code review guidelines.
4. Navigate to the `devops/` directory to review CI/CD notes, environment configuration, and deployment documentation.
5. Review `README-SUBMISSION.md` for the overall approach, scope, and assessment summary.

### 9.2 Run the Application with Docker

Prerequisites:
- Git
- Docker Desktop
- Docker Compose

Clone the repository:

```bash
git clone https://github.com/Tadiyos-2225/QA-Devops-Submission.git
cd QA-Devops-Submission
```

Configure the environment:

```bash
cp .env.example .env
```

Update the local `.env` file with appropriate database credentials. Do not commit actual secrets.

Build and start the application:

```bash
docker compose up -d --build
```

Check container status:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f api
```

View database logs:

```bash
docker compose logs -f db
```

### 9.3 Verify API Endpoints

Once the application is running, use Postman, curl, or PowerShell to inspect the API responses.

Health endpoint:

```http
GET http://localhost:4000/health
```

Users endpoint:

```http
GET http://localhost:4000/users
```

These requests can be used to verify application availability, database connectivity, and the Users API behavior.

The health endpoint should return a successful response when the application and database connectivity check are working. The Users endpoint should return the expected user data when the database schema has been initialized.

### 9.4 Run the Automated Tests

Install dependencies:

```bash
npm ci
```

Run the unit tests:

```bash
npm test
```

Run the API end-to-end tests using the project's configured Jest test command and test configuration.

Review the test output for passed and failed scenarios.

### 9.5 Review the Performance Test

The performance test script is available under the `test/qa/automation` directory.

Run it using:

```bash
k6 run test/qa/automation/performance-test.js
```

Review the request failure rate, average response time, p95 response time, and configured thresholds.

The results provide an overview of API performance under the configured test load.

### 9.6 Review the CI Pipeline

Navigate to the repository's **Actions** tab on GitHub.

Open the **QA Assessment CI** workflow to inspect the execution of:

- Dependency installation.
- ESLint.
- Application build.
- Unit tests.

The workflow results provide visibility into the automated quality checks configured for the repository.

### 9.7 Review Deployment Documentation

Review the following files for deployment and operational details:

- `devops/ci-notes.md`
- `devops/environment-notes.md`
- `devops/deployment-runbook.md`

These documents explain the CI pipeline, environment configuration, application startup, health verification, troubleshooting, and rollback approach.

**Verification note:** The commands above describe how to reproduce and inspect the work. Successful execution should be confirmed against the actual repository configuration and test results. The AWS architecture is a proposal rather than a live deployment.

## 10. Assumptions, Limitations, and Future Improvements

The following points describe the current scope and opportunities for further improvement:

- Detailed QA implementation was prioritized around the Users module and its underlying database table.
- Products and Transactions require additional automated test coverage.
- Performance results reflect the local execution environment and are not production capacity measurements.
- Docker deployment was validated locally, while cloud deployment remains a proposed architecture.
- The health endpoint and database schema should be fully verified as part of final application validation.
- Database migration management should be strengthened to ensure consistent schema creation and updates across environments.
- CI/CD can be extended to publish Docker images and deploy automatically to a staging environment.
- Additional monitoring, centralized logging, and test coverage can improve long-term reliability.

## 11. Final Summary

This assessment demonstrates my approach to combining Software Quality Assurance with practical DevOps engineering.

Within the available assessment timeframe, I prioritized depth over breadth by focusing on the Users module to demonstrate test design, API automation, defect investigation, and performance evaluation.

In addition, I addressed the broader application delivery lifecycle through CI/CD preparation, Docker containerization, environment configuration, health monitoring, deployment documentation, and a proposed AWS cloud deployment architecture.

I have included clear instructions so the reviewers can inspect the source code, execute the tests, run the application locally, review the performance results, and verify the CI workflow.

My overall objective was to demonstrate not only the ability to identify software defects but also the ability to improve application reliability, automate quality checks, and establish a maintainable foundation for deployment.

The submission reflects a practical, quality-focused engineering approach, with clear documentation of implemented work, scope decisions, limitations, and future improvements.