# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only package.json and yarn.lock to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy application code
COPY . .

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Disable ESLint during build
ENV NEXT_DISABLE_ESLINT=1

# Build the Next.js application
RUN yarn build

# Stage 3: Prepare the production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["node", "server.js"]
