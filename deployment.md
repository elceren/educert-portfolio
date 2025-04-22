# EduCert Platform Deployment Guide

This document provides instructions for deploying the EduCert online education platform in both development and production environments.

## System Requirements

### Server Requirements
- **Operating System**: Ubuntu 20.04 LTS or newer
- **CPU**: 2+ cores
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 20GB minimum

### Software Requirements
- **Node.js**: v16.x or newer
- **MySQL**: v8.0 or newer
- **Nginx**: v1.18 or newer (for production)
- **PM2**: For process management in production

## Development Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-organization/educert-platform.git
cd educert-platform
```

### 2. Database Setup
```bash
# Install MySQL if not already installed
sudo apt update
sudo apt install mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql
```

In the MySQL prompt:
```sql
CREATE DATABASE educert;
CREATE USER 'educert_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON educert.* TO 'educert_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import the database schema:
```bash
mysql -u educert_user -p educert < database_schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit the `.env` file with your database credentials and other configuration:
```
DB_HOST=localhost
DB_USER=educert_user
DB_PASSWORD=your_secure_password
DB_NAME=educert
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit the `.env` file:
```
REACT_APP_API_URL=http://localhost:3000/api
```

Start the frontend development server:
```bash
npm start
```

The application should now be running at:
- Backend API: http://localhost:3000/api
- Frontend: http://localhost:3001

## Production Deployment

### 1. Server Preparation
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y nodejs npm mysql-server nginx

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Database Setup
Follow the same database setup steps as in the development environment, but use stronger passwords.

### 3. Backend Deployment
```bash
cd /var/www
sudo git clone https://github.com/your-organization/educert-platform.git
cd educert-platform/backend

# Install dependencies
sudo npm install --production

# Configure environment variables for production
sudo cp .env.example .env
sudo nano .env
```

Edit the `.env` file with production values:
```
DB_HOST=localhost
DB_USER=educert_user
DB_PASSWORD=your_secure_production_password
DB_NAME=educert
JWT_SECRET=your_secure_production_jwt_secret
PORT=3000
NODE_ENV=production
```

Start the backend with PM2:
```bash
sudo pm2 start src/server.js --name educert-backend
sudo pm2 save
sudo pm2 startup
```

### 4. Frontend Deployment
```bash
cd ../frontend

# Install dependencies
sudo npm install

# Build the production version
sudo npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/educert
```

Add the following Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/educert-platform/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/educert /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Configuration (Recommended)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Certbot will modify your Nginx configuration automatically
```

### 6. Firewall Configuration
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## Maintenance and Updates

### Updating the Application
```bash
cd /var/www/educert-platform

# Pull latest changes
sudo git pull

# Update backend
cd backend
sudo npm install --production
sudo pm2 restart educert-backend

# Update frontend
cd ../frontend
sudo npm install
sudo npm run build
```

### Database Backups
```bash
# Create a backup script
sudo nano /usr/local/bin/backup-educert-db.sh
```

Add the following content:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_DIR="/var/backups/educert"
mkdir -p $BACKUP_DIR
mysqldump -u educert_user -p'your_secure_production_password' educert > $BACKUP_DIR/educert_$TIMESTAMP.sql
gzip $BACKUP_DIR/educert_$TIMESTAMP.sql
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -delete
```

Make it executable and schedule with cron:
```bash
sudo chmod +x /usr/local/bin/backup-educert-db.sh
sudo crontab -e
```

Add the following line to run daily at 2 AM:
```
0 2 * * * /usr/local/bin/backup-educert-db.sh
```

## Troubleshooting

### Common Issues

1. **Backend API not responding**
   - Check if the Node.js process is running: `pm2 status`
   - Check the logs: `pm2 logs educert-backend`
   - Verify database connection settings in the .env file

2. **Frontend not loading**
   - Check Nginx configuration: `sudo nginx -t`
   - Check Nginx logs: `sudo cat /var/log/nginx/error.log`
   - Verify that the build directory contains the compiled frontend files

3. **Database connection issues**
   - Verify MySQL is running: `sudo systemctl status mysql`
   - Check user permissions: `mysql -u educert_user -p`
   - Verify connection settings in the backend .env file

### Logs
- Backend logs: `pm2 logs educert-backend`
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`
- MySQL logs: `/var/log/mysql/error.log`

## Support
For additional support, please contact the development team at support@educert-platform.com
