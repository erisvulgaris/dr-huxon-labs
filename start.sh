#!/bin/sh
npx prisma db push
node .next/standalone/server.js
