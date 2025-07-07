#!/bin/bash

# EC2 Server Setup Script for Talentora Webapp
# This script sets up Docker, Docker Compose, and necessary configurations

set -e

echo "🚀 Setting up EC2 server for Talentora Webapp deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose standalone
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add current user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER

# Remove nginx if present (conflicts with webapp on port 80)
echo "🚫 Removing nginx to free up port 80..."
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl disable nginx 2>/dev/null || true
sudo apt-get remove -y nginx nginx-core nginx-common 2>/dev/null || true
sudo apt-get autoremove -y

# Install additional utilities
echo "🛠️ Installing additional utilities..."
sudo apt-get install -y curl wget git htop ufw fail2ban

# Set up firewall
echo "🔥 Setting up firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp  # Supabase Kong
sudo ufw allow 3030/tcp  # Supabase Studio
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /home/ubuntu/talentora-webapp
sudo chown -R ubuntu:ubuntu /home/ubuntu/talentora-webapp

# Create logs directory
echo "📄 Creating logs directory..."
sudo mkdir -p /var/log/talentora
sudo chown -R ubuntu:ubuntu /var/log/talentora

# Install Node.js and npm (for local development/debugging)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Set up log rotation
echo "🔄 Setting up log rotation..."
sudo tee /etc/logrotate.d/talentora > /dev/null << 'EOF'
/var/log/talentora/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        /usr/bin/docker-compose -f /home/ubuntu/talentora-webapp/docker-compose.lightweight.yml restart > /dev/null 2>&1 || true
    endscript
}
EOF

# Create systemd service for auto-restart
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/talentora-webapp.service > /dev/null << 'EOF'
[Unit]
Description=Talentora Webapp Docker Compose (Lightweight)
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/talentora-webapp
ExecStart=/usr/local/bin/docker-compose -f docker-compose.lightweight.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.lightweight.yml down
TimeoutStartSec=0
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable talentora-webapp.service

# Create backup script (lightweight version)
echo "💾 Creating backup script..."
sudo tee /home/ubuntu/backup-talentora.sh > /dev/null << 'EOF'
#!/bin/bash

# Backup script for Talentora Webapp (Lightweight)
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup environment files
echo "Backing up environment files..."
cp /home/ubuntu/talentora-webapp/.env.local $BACKUP_DIR/env_backup_$DATE.env 2>/dev/null || echo "No .env.local file found"

# Backup application logs
echo "Backing up application logs..."
cp -r /var/log/talentora $BACKUP_DIR/logs_backup_$DATE 2>/dev/null || echo "No logs found"

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "*backup*" -mtime +7 -delete

echo "Backup completed: $DATE"
echo "Note: Database backups are handled by cloud Supabase"
EOF

sudo chmod +x /home/ubuntu/backup-talentora.sh

# Set up cron job for daily backups
echo "⏰ Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup-talentora.sh >> /var/log/talentora/backup.log 2>&1") | crontab -

echo "✅ EC2 server setup complete (Lightweight Version)!"
echo ""
echo "✨ This setup uses:"
echo "- Lightweight webapp container only"
echo "- Cloud Supabase (no self-hosted database)"
echo "- Nginx removed to free port 80"
echo "- Minimal resource usage"
echo ""
echo "Next steps:"
echo "1. Logout and login again to apply docker group changes"
echo "2. Your GitHub Actions will automatically deploy on push"
echo "3. Ensure cloud Supabase is configured in your GitHub secrets"
echo "4. Push to staging branch to trigger deployment"
echo ""
echo "Useful commands:"
echo "- Check service status: systemctl status talentora-webapp"
echo "- View logs: docker-compose -f docker-compose.lightweight.yml logs -f"
echo "- Run backup manually: /home/ubuntu/backup-talentora.sh"
echo "- Monitor resources: htop (should be very light!)" 