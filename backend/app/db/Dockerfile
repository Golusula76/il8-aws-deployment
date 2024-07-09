# Use the official MySQL 5.7 image from Docker Hub
FROM mysql:5.7

# Environment variables
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=LMS_21_June
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=password

# Copy the initialization script into the docker-entrypoint-initdb.d/ directory
# Scripts in this directory will be automatically executed during container startup
COPY init.sql /docker-entrypoint-initdb.d/

# Expose MySQL default port
EXPOSE 3306

# Optional: Health check to verify MySQL service is up
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p$password || exit 1
