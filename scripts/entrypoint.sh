#!/bin/sh

cd /usr/src/app

echo "📦 Running db:generate..."
pnpm run db:generate

echo "📦 Running db:migrate..."
pnpm run db:migrate

echo "🚀 Starting server..."
exec node src/index.js
