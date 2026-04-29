# Client Onboarding Mobile App

This is a Capacitor + React project prepared for building an Android APK.

## Build a debug APK

Install Android Studio, Node.js, and Java, then run:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

The APK will be created at `android/app/build/outputs/apk/debug/app-debug.apk`.

You can install that APK on Android phones after enabling installation from unknown sources.

## Build with GitHub Actions

Push this folder to a GitHub repository and run the included workflow. It will upload `app-debug.apk` as a build artifact.
