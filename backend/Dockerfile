# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies (including dev for prisma CLI and typescript)
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client (already done by npm install if it's in postinstall, but explicit is fine)
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Build TypeScript code
RUN npm run build # This runs tsc

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Set NODE_ENV to production
ENV NODE_ENV=production
# DATABASE_URL will be set via docker-compose
# JWT_SECRET will be set via docker-compose
# PORT will be set via docker-compose or default to 3001

# Copy installed production dependencies from builder stage
# Create node_modules directory for production dependencies
RUN mkdir -p node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy compiled code from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy Prisma schema, migrations and generated client from builder stage
COPY --from=builder /usr/src/app/prisma ./prisma

# Copy package.json to have access to prisma CLI via npx for migrations
COPY package.json .
COPY package-lock.json .
# We need to install prisma client and CLI for running migrations,
# but only production application dependencies should remain in the final image.
# So, install all deps to run migrate, then prune dev deps.
RUN npm install --only=production 

# Expose the port the app runs on
EXPOSE 3001

# Command to run migrations and then the application
# Note: `prisma migrate deploy` is for applying already generated and committed migrations.
# `prisma db push` might be simpler for SQLite if schema drift is managed and data loss acceptable in dev.
# For this project, `migrate deploy` is safer for a "production-like" Docker build.
# The `prisma:migrate` script in package.json uses `migrate dev`, which is not ideal for this CMD.
# So, directly use `prisma migrate deploy`.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
