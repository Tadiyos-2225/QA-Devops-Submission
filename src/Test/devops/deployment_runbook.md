# Deployment Runbook – QA Assessment Application

**Application:** QA Assessment API  
**Technology:** NestJS, Node.js, PostgreSQL  
**Containerization:** Docker and Docker Compose  
**API Port:** 4000  
**Database Port:** 5432  
**Deployment Environment:** Docker-based environment

---

## 1. Purpose

This runbook describes how to build, deploy, verify, troubleshoot, and roll back the QA Assessment application.

It provides operational instructions for maintaining application availability and resolving common deployment issues.

## 2. Prerequisites

Before deployment, ensure the following tools are installed and available:

- Docker Desktop or Docker Engine
- Docker Compose
- Node.js and npm (for local development)
- Git
- Access to the project repository

Verify Docker installation:

```bash
docker --version
docker compose version
docker info
```

Ensure the Docker Engine is running before proceeding.

## 3. Environment Configuration

Create a `.env` file in the project root using `.env.example` as a template.

Example:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=QA-Assessment
```

For Docker Compose deployment, the API service overrides `DB_HOST` with `db` to communicate with the PostgreSQL container.

**Security requirements:**

- Never commit `.env` to Git.
- Do not hardcode credentials in Dockerfiles.
- Use secure credentials for staging and production.
- Store production secrets in a secrets manager.

## 4. Build and Deployment Procedure

### 4.1 Get the Latest Source Code

Clone the repository:

```bash
git clone <repository-url>
cd QA-Assessment
```

For an existing repository:

```bash
git pull origin main
```

### 4.2 Validate Docker Compose Configuration

Check the Compose configuration:

```bash
docker compose config --quiet
```

If no errors are reported, proceed.

### 4.3 Build Docker Images

Build the application image:

```bash
docker compose build
```

Alternatively, build and start the services together:

```bash
docker compose up -d --build
```

### 4.4 Verify Running Containers

Check service status:

```bash
docker compose ps
```

Expected services:

| Service | Container | Expected Status |
|---|---|---|
| API | shop-api | Up |
| Database | shop-db | Up (healthy) |

### 4.5 Verify Application Logs

Check API logs:

```bash
docker compose logs --tail=100 api
```

Check database logs:

```bash
docker compose logs --tail=100 db
```

Follow logs continuously:

```bash
docker compose logs -f
```

### 4.6 Verify Application Health

Check the health endpoint:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{
  "status": "ok",
  "application": "running",
  "database": "connected",
  "timestamp": "2026-11-19T13:00:00.000Z"
}
```

Expected HTTP status: `200 OK`.

### 4.7 Verify API Functionality

Test the main endpoints:

```bash
curl http://localhost:4000/
curl http://localhost:4000/users
curl http://localhost:4000/products
curl http://localhost:4000/transactions
```

For write operations, execute appropriate POST, PUT, and DELETE tests using valid request payloads.

Confirm that the API returns expected responses and database operations work correctly.

---

## 5. Rollback Procedure

Rollback should be performed when a new deployment introduces critical application failures, database connectivity issues, or unexpected behavior.

### 5.1 Identify the Previous Working Version

Identify the last known good Git commit:

```bash
git log --oneline -10
```

Record the commit hash of the previous stable release.

### 5.2 Restore the Previous Application Version

For a Docker Compose deployment:

```bash
git checkout <previous-stable-commit>
```

Rebuild and restart the application:

```bash
docker compose up -d --build
```

### 5.3 Verify the Rollback

Check the running containers:

```bash
docker compose ps
```

Check application logs:

```bash
docker compose logs --tail=100 api
```

Verify application availability:

```bash
curl http://localhost:4000/health
```

Run basic API smoke tests to confirm that the previous version is operational.

### 5.4 Database Rollback Considerations

Application rollback does not automatically reverse database schema changes.

Before deploying database migrations:

- Back up the database.
- Review migration compatibility.
- Prepare a rollback migration when possible.
- Avoid destructive schema changes without a recovery plan.

Database backup command:

```bash
docker compose exec -T db pg_dump \
  -U postgres \
  -d QA-Assessment \
  > backup.sql
```

Restore a backup only after confirming the target database and recovery requirements. A restore may overwrite existing data.

**Important:** Never use `docker compose down -v` as a routine rollback command because it removes named volumes and can permanently delete the PostgreSQL data stored in them.

---

## 6. Common Failures and Troubleshooting

| Problem | Possible Cause | Resolution |
|---|---|---|
| Docker Engine unavailable | Docker Desktop is not running | Start Docker Desktop and verify using `docker info` |
| Compose configuration not found | Terminal is in the wrong directory | Navigate to the project root |
| Docker build fails | Missing dependencies or invalid lockfile | Verify `package.json`, `package-lock.json`, and Dockerfile |
| API container keeps restarting | NestJS startup exception | Inspect API logs using `docker compose logs api` |
| Database connection refused | Incorrect database hostname or database not ready | Use `DB_HOST=db` inside Docker and wait for database health |
| Database table does not exist | Entity schema has not been created or migrated | Verify TypeORM entity registration and database migrations |
| Port 4000 already in use | Another application occupies the port | Stop the conflicting process or change the published port |
| API returns HTTP 500 | Application exception or database query failure | Inspect application logs and database schema |
| Health endpoint returns HTTP 503 | Database connectivity check failed | Check PostgreSQL status and API database configuration |
| Container is unhealthy | Health endpoint fails or application is not ready | Inspect container logs and health-check configuration |

### Useful Diagnostic Commands

Check container status:

```bash
docker compose ps
```

Inspect API logs:

```bash
docker compose logs --tail=100 api
```

Inspect database logs:

```bash
docker compose logs --tail=100 db
```

Check database readiness:

```bash
docker compose exec db pg_isready -U postgres -d QA-Assessment
```

Check container resource utilization:

```bash
docker stats
```

Restart the API:

```bash
docker compose restart api
```

Restart all services:

```bash
docker compose restart
```

---

## 7. Maintenance Procedures

### 7.1 Update Application

Pull the latest source code and rebuild:

```bash
git pull origin main
docker compose up -d --build
```

### 7.2 Monitor Logs

```bash
docker compose logs -f api
```

Review application errors and unexpected behavior regularly.

### 7.3 Check Resource Utilization

```bash
docker stats
```

Monitor CPU and memory usage to identify resource constraints.

### 7.4 Stop Services

```bash
docker compose down
```

This stops and removes containers and networks but preserves named volumes by default.

---

## 8. Deployment Checklist

Use this checklist before and after each deployment.

### Before Deployment

- [ ] Latest source code is available.
- [ ] Environment variables are configured.
- [ ] Secrets are not committed to Git.
- [ ] Docker Compose configuration is valid.
- [ ] CI pipeline passes.
- [ ] Database backup is available when required.
- [ ] Previous stable version is identified.

### After Deployment

- [ ] Docker images build successfully.
- [ ] API container is running.
- [ ] PostgreSQL container is healthy.
- [ ] API logs show successful startup.
- [ ] `/health` returns HTTP 200.
- [ ] Main API endpoints respond correctly.
- [ ] Database operations are successful.
- [ ] No critical errors appear in application logs.

---

## 9. Conclusion

This runbook provides a repeatable procedure for building, deploying, monitoring, troubleshooting, and rolling back the QA Assessment application.

Docker Compose simplifies application deployment by managing the NestJS API and PostgreSQL database as coordinated services.

The documented verification and rollback procedures help maintain application reliability and reduce deployment risks.

For future improvements, the deployment process can be automated using GitHub Actions and extended to cloud environments such as AWS ECS Fargate.
