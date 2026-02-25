#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /Users/macbook/Desktop/75

export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools

echo -e "${YELLOW}⬇️  Pulling latest changes from GitHub...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pnpm install

echo -e "${YELLOW}🏗️  Building web app...${NC}"
pnpm build

echo -e "${YELLOW}🔄 Syncing to Android...${NC}"
npx cap sync android

echo -e "${YELLOW}🔨 Building APK...${NC}"
cd android && ./gradlew assembleDebug

echo -e "${YELLOW}📋 Copying APK to Desktop...${NC}"
cp app/build/outputs/apk/debug/app-debug.apk ~/Desktop/75-app.apk

echo ""
echo -e "${GREEN}✅ Done! APK is at ~/Desktop/75-app.apk${NC}"
echo -e "${GREEN}📱 Transfer it to your phone and install!${NC}"
