# 6. Cloud Deployment Plan 

## 6.1 Selected Cloud Platform

**Platform:** Amazon Web Services (AWS)

**Deployment approach:** Amazon ECS with AWS Fargate.

AWS ECS Fargate is selected because it allows containerized applications to run without requiring manual management of virtual machines or server infrastructure.

## 6.2 AWS Services

| AWS Service | Purpose |
|---|---|
| Amazon ECR | Store and manage Docker images |
| Amazon ECS | Orchestrate and manage application containers |
| AWS Fargate | Run containers without managing servers |
| Amazon RDS PostgreSQL | Provide managed PostgreSQL database hosting |
| Application Load Balancer | Distribute incoming application traffic |
| AWS Secrets Manager | Securely store database credentials |
| Amazon CloudWatch | Monitor application logs, errors, and resource utilization |

## 6.3 Deployment Process

### Step 1: Build the Docker Image

Build the application Docker image using the existing Dockerfile.

### Step 2: Push the Image to Amazon ECR

Create an ECR repository, authenticate Docker, tag the image, and push it to the repository.

### Step 3: Configure the Database

Create an Amazon RDS PostgreSQL instance.

Configure the database name, username, and password. Store sensitive credentials in AWS Secrets Manager and restrict database access to the application service.

### Step 4: Deploy Using Amazon ECS Fargate

Create an ECS cluster and task definition.

Configure the task definition with:

- Application Docker image from ECR.
- CPU and memory allocation.
- Container port 4000.
- Required environment variables.
- Database credentials from Secrets Manager.
- Application health-check configuration.

Deploy the application as an ECS Fargate service.

### Step 5: Configure Application Load Balancer

Create an Application Load Balancer to receive incoming HTTP/HTTPS requests and forward them to the NestJS application.

Configure `/health` as the target group health-check endpoint.

### Step 6: Configure Monitoring

Use Amazon CloudWatch to monitor:

- Application logs and errors.
- Container CPU and memory utilization.
- Application availability.
- Container health status.
- Database performance.

## 6.4 CI/CD Integration

The existing GitHub Actions CI pipeline can be extended into a deployment pipeline.

Proposed workflow:

1. Developer pushes code to GitHub.
2. GitHub Actions runs linting, building, and unit tests.
3. If all checks pass, GitHub Actions builds the Docker image.
4. The image is pushed to Amazon ECR.
5. ECS is updated to deploy the new image.
6. The deployment is verified using the `/health` endpoint.

GitHub Actions OIDC can be used to authenticate securely with AWS without storing long-lived AWS access keys in the repository.

## 6.5 Security and Reliability

The deployment will follow these practices:

- Use HTTPS for secure communication.
- Store credentials in AWS Secrets Manager.
- Apply IAM roles with least-privilege permissions.
- Keep the database private within the VPC.
- Enable automated database backups.
- Configure health checks and container recovery.
- Use CloudWatch alarms for errors and resource utilization.
- Use rolling deployments to reduce application downtime.

## 6.6 Expected Outcome

The NestJS application will run as a containerized service on AWS ECS Fargate, while Amazon RDS PostgreSQL will provide managed and persistent database storage.

Amazon ECR will manage Docker images, the Application Load Balancer will handle incoming traffic, and CloudWatch will provide monitoring and logging.

This approach provides a scalable deployment architecture and a foundation for implementing continuous delivery and continuous deployment.
