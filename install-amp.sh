#!/bin/bash

# Default values
SEED=false
DEPLOY=false

# Parse command-line arguments
for arg in "$@"
do
    case $arg in
        --seed)
        SEED=true
        shift # Remove --seed from processing
        ;;
        --deploy)
        DEPLOY=true
        shift # Remove --deploy from processing
        ;;
    esac
done

# --- Seed Firestore ---
if [ "$SEED" = true ] ; then
    echo "Seeding Firestore..."
    if [ -f "./.firebase-admin-key.json" ]; then
        node scripts/seed-amp-event.mjs
    else
        echo "Error: .firebase-admin-key.json not found. This file is required to seed Firestore."
        echo "Please create this file with your Firebase Admin SDK credentials."
    fi
fi

# --- Build and Deploy ---
if [ "$DEPLOY" = true ] ; then
    echo "Building Next.js app..."
    npm run build

    echo "Deploying to Firebase..."
    firebase deploy
fi

# --- If no arguments, show help ---
if [ "$SEED" = false ] && [ "$DEPLOY" = false ]; then
    echo "Usage: bash install-amp.sh [options]"
    echo ""
    echo "Options:"
    echo "  --seed         Seeds Firestore with data from scripts/seed-amp-event.mjs"
    echo "  --deploy       Builds the Next.js app and deploys to Firebase"
    echo "  --seed --deploy  Does both seeding and deploying"
fi