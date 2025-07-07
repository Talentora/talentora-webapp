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

# Install additional utilities
echo "🛠️ Installing additional utilities..."
sudo apt-get install -y curl wget git htop nginx-core ufw fail2ban

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
        /usr/bin/docker-compose -f /home/ubuntu/talentora-webapp/docker-compose.yml restart > /dev/null 2>&1 || true
    endscript
}
EOF

# Create systemd service for auto-restart
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/talentora-webapp.service > /dev/null << 'EOF'
[Unit]
Description=Talentora Webapp Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/talentora-webapp
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable talentora-webapp.service

# Create backup script
echo "💾 Creating backup script..."
sudo tee /home/ubuntu/backup-talentora.sh > /dev/null << 'EOF'
#!/bin/bash

# Backup script for Talentora Webapp
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup Docker volumes
echo "Backing up Docker volumes..."
docker run --rm -v talentora-webapp_supabase-db-data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/db_backup_$DATE.tar.gz /data
docker run --rm -v talentora-webapp_supabase-storage-data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/storage_backup_$DATE.tar.gz /data

# Backup environment files
echo "Backing up environment files..."
cp /home/ubuntu/talentora-webapp/.env.local $BACKUP_DIR/env_backup_$DATE.env

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.env" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /home/ubuntu/backup-talentora.sh

# Set up cron job for daily backups
echo "⏰ Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup-talentora.sh >> /var/log/talentora/backup.log 2>&1") | crontab -

echo "✅ EC2 server setup complete!"
echo ""
echo "Next steps:"
echo "1. Logout and login again to apply docker group changes"
echo "2. Clone your repository to /home/ubuntu/talentora-webapp"
echo "3. Create your .env.local file with all required environment variables"
echo "4. Run 'docker-compose up -d' to start the application"
echo ""
echo "Useful commands:"
echo "- Check service status: systemctl status talentora-webapp"
echo "- View logs: docker-compose logs -f"
echo "- Run backup manually: /home/ubuntu/backup-talentora.sh"
echo "- Monitor resources: htop" 