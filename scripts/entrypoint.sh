#!/bin/sh

export HOME=/tmp

cd /usr/src/app

echo "📦 Running db:generate..."
pnpm run db:generate

echo "📦 Running db:migrate..."
pnpm run db:migrate

echo "🚀 Starting server with PM2 cluster mode..."
exec pnpm exec pm2-runtime ecosystem.config.cjs