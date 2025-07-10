# Talentora Webapp - EC2 Deployment Guide

This guide explains how to deploy the Talentora webapp to AWS EC2 using GitHub Actions with full Supabase Docker container support.

## 🏗️ Architecture Overview

The deployment includes:
- **Next.js Webapp**: Your main application
- **Supabase Services**: Complete self-hosted Supabase stack
  - PostgreSQL Database
  - Auth Service (GoTrue)
  - REST API (PostgREST)
  - Realtime Service
  - Storage Service
  - Kong API Gateway
  - Supabase Studio (Admin UI)

## 📋 Prerequisites

1. **AWS EC2 Instance**
   - Ubuntu 20.04 LTS or later
   - At least 4GB RAM (8GB recommended)
   - 20GB+ storage
   - Security groups allowing ports: 22, 80, 443, 8000, 3030

2. **GitHub Repository Secrets**
   - Docker Hub credentials
   - EC2 access credentials
   - All application environment variables

3. **Domain Setup** (Optional but recommended)
   - Domain pointing to your EC2 instance
   - SSL certificate setup

## 🚀 Step-by-Step Deployment

### 1. Set Up Your EC2 Instance

**Option A: Use our setup script**
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/your-username/talentora-webapp/main/scripts/deploy-ec2.sh | bash
```

**Option B: Manual setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p /home/ubuntu/talentora-webapp
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and Variables → Actions

**Required Secrets:**

```yaml
# Docker Hub
DOCKERHUB_USERNAME: your_dockerhub_username
DOCKERHUB_TOKEN: your_dockerhub_access_token

# EC2 Access
EC2_HOST: your-ec2-ip-address
EC2_PRODUCTION_HOST: your-production-ec2-ip  # If different from staging
EC2_USER: ubuntu
EC2_SSH_KEY: |
  -----BEGIN RSA PRIVATE KEY-----
  your-private-key-content
  -----END RSA PRIVATE KEY-----

# Supabase
NEXT_PUBLIC_STAGING_SUPABASE_URL: https://your-staging-project.supabase.co
NEXT_PUBLIC_STAGING_SUPABASE_ANON_KEY: your_staging_anon_key
NEXT_PUBLIC_PRODUCTION_SUPABASE_URL: https://your-production-project.supabase.co
NEXT_PUBLIC_PRODUCTION_SUPABASE_ANON_KEY: your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY: your_service_role_key
SUPABASE_PASSWORD: your_secure_database_password
JWT_SECRET: your_jwt_secret_key

# Application
NEXT_PUBLIC_SITE_URL: https://your-domain.com
NEXT_PUBLIC_BASE_URL: https://your-domain.com

# Third-party Services
STRIPE_SECRET_KEY: sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_your_stripe_publishable_key
NEXT_PUBLIC_GROQ_API_KEY: your_groq_api_key
NEXT_PUBLIC_MERGE_API_KEY: your_merge_api_key
NEXT_PUBLIC_CARTESIA_API_KEY: your_cartesia_api_key
NEXT_PUBLIC_DAILY_API_KEY: your_daily_api_key
LIVEKIT_API_KEY: your_livekit_api_key
LIVEKIT_API_SECRET: your_livekit_api_secret
RESEND_API_KEY: your_resend_api_key

# AWS
AWS_REGION: us-east-1
AWS_ACCESS_KEY_ID: your_aws_access_key_id
AWS_SECRET_ACCESS_KEY: your_aws_secret_access_key

# OAuth
SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID: your_github_oauth_client_id
SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET: your_github_oauth_client_secret
STAGING_SUPABASE_AUTH_EXTERNAL_GITHUB_REDIRECT_URI: https://staging.your-domain.com/auth/callback
PRODUCTION_SUPABASE_AUTH_EXTERNAL_GITHUB_REDIRECT_URI: https://your-domain.com/auth/callback
```

### 3. Environment Variables Setup

Use the `env.template` file as a reference for all required environment variables. Each deployment environment (staging/production) should have its own set of values.

### 4. Deployment Process

**Staging Deployment:**
- Push to `staging` branch
- GitHub Actions will automatically deploy to staging EC2

**Production Deployment:**
- Push to `main` branch
- GitHub Actions will automatically deploy to production EC2

## 🔧 Configuration Files

### Docker Compose Files

- `docker-compose.yml`: Development and staging
- `docker-compose.prod.yml`: Production with full Supabase stack

### Supabase Configuration

- `supabase/config/kong.yml`: API Gateway configuration
- `supabase/migrations/`: Database migrations
- `supabase/config.toml`: Supabase project configuration

## 🌐 Accessing Your Application

After deployment, your services will be available at:

- **Main Application**: `http://your-ec2-ip` (port 80)
- **Supabase API**: `http://your-ec2-ip:8000`
- **Supabase Studio**: `http://your-ec2-ip:3030`
- **Direct Database**: `your-ec2-ip:5432`

## 🔍 Monitoring and Troubleshooting

### Check Service Status
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Check Docker containers
docker ps

# Check Docker Compose services
cd /home/ubuntu/talentora-webapp
docker-compose ps

# View logs
docker-compose logs -f webapp
docker-compose logs -f supabase-db
```

### Common Issues

**1. Container won't start:**
```bash
# Check logs
docker-compose logs -f service-name

# Check environment variables
cat .env.local
```

**2. Database connection issues:**
```bash
# Check database health
docker-compose exec supabase-db pg_isready -U postgres

# Check database logs
docker-compose logs -f supabase-db
```

**3. Application not accessible:**
```bash
# Check if port 80 is open
sudo ufw status
sudo netstat -tlnp | grep :80

# Check webapp logs
docker-compose logs -f webapp
```

### Log Files

- Application logs: `/var/log/talentora/`
- Docker logs: `docker-compose logs`
- System logs: `/var/log/syslog`

## 🔐 Security Best Practices

1. **Firewall Configuration**
   - Only open necessary ports
   - Use security groups in AWS
   - Configure fail2ban for SSH protection

2. **Environment Variables**
   - Never commit `.env.local` files
   - Use strong, unique passwords
   - Rotate secrets regularly

3. **Database Security**
   - Use strong database passwords
   - Enable SSL connections
   - Regular backups

4. **SSL/TLS**
   - Use HTTPS in production
   - Configure SSL certificates
   - Enable HSTS headers

## 📦 Backup and Recovery

### Automated Backups

The deployment includes automated daily backups:
- Database backups: `/home/ubuntu/backups/`
- Storage backups: `/home/ubuntu/backups/`
- Configuration backups: `/home/ubuntu/backups/`

### Manual Backup

```bash
# Run backup manually
/home/ubuntu/backup-talentora.sh

# Restore from backup
docker run --rm -v talentora-webapp_supabase-db-data:/data -v /home/ubuntu/backups:/backup alpine tar xzf /backup/db_backup_DATE.tar.gz
```

## 🔄 Updates and Maintenance

### Application Updates

Updates are automatically deployed when you push to the configured branches:
- `staging` branch → Staging environment
- `main` branch → Production environment

### Manual Updates

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to app directory
cd /home/ubuntu/talentora-webapp

# Pull latest changes
git pull origin main

# Update containers
docker-compose down
docker-compose pull
docker-compose up -d
```

### System Maintenance

```bash
# Clean up unused Docker resources
docker system prune -f

# Update system packages
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Monitor resources
htop
```

## 🆘 Support and Troubleshooting

### Health Checks

- Application health: `http://your-ec2-ip/api/health`
- Database health: `docker-compose exec supabase-db pg_isready -U postgres`

### Performance Monitoring

```bash
# Check resource usage
htop

# Check Docker stats
docker stats

# Check disk usage
df -h
du -sh /var/lib/docker/
```

### Getting Help

1. Check the logs first
2. Verify all environment variables are set
3. Ensure all services are running
4. Check network connectivity
5. Review the GitHub Actions workflow logs

## 📚 Additional Resources

- [Supabase Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)

---

For specific issues or questions, please check the logs and refer to the troubleshooting section above. 