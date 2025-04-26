# Production
FROM node:lts-alpine AS production
COPY ws/files/ /var/www/ws/
CMD node /var/www/ws/smashserver.js

# Development
FROM node:lts-alpine AS development
CMD node /var/www/ws/smashserver.js
