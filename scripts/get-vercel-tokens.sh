#!/bin/bash

# Script to extract Vercel tokens and IDs for GitHub Actions
# Make sure you're logged in to Vercel CLI first with: vercel login

# Create output file
OUTPUT_FILE="vercel_properties.txt"
echo "# Vercel Properties for GitHub Actions" > $OUTPUT_FILE
echo "# Generated on $(date)" >> $OUTPUT_FILE
echo "# Add these as secrets in your GitHub repository" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI is not installed. Please install it with 'npm i -g vercel'" >> $OUTPUT_FILE
    exit 1
fi


# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "Error: You're not logged in to Vercel. Please run 'vercel login' first" >> $OUTPUT_FILE
    exit 1
fi

# Get Vercel token from the config file
echo "Getting Vercel token..."
CONFIG_DIR="$HOME/.config/vercel"
if [ -d "$CONFIG_DIR" ]; then
    # Try to find the token in the new config location
    TOKEN_FILE=$(find "$CONFIG_DIR" -name "auth.json" | head -1)
    if [ -n "$TOKEN_FILE" ]; then
        VERCEL_TOKEN=$(grep -o "\"token\":\"[^\"]*\"" "$TOKEN_FILE" | cut -d'"' -f4)
    fi
fi

# If token not found in new location, try legacy location
if [ -z "$VERCEL_TOKEN" ]; then
    LEGACY_CONFIG="$HOME/.vercel/auth.json"
    if [ -f "$LEGACY_CONFIG" ]; then
        VERCEL_TOKEN=$(grep -o "\"token\":\"[^\"]*\"" "$LEGACY_CONFIG" | cut -d'"' -f4)
    fi
fi

# If still not found, try another approach with the newer CLI
if [ -z "$VERCEL_TOKEN" ]; then
    echo "Could not automatically find Vercel token."
    echo "Please create a token manually at https://vercel.com/account/tokens" >> $OUTPUT_FILE
    echo "VERCEL_TOKEN=<create_manually_at_vercel.com/account/tokens>" >> $OUTPUT_FILE
else
    echo "VERCEL_TOKEN=$VERCEL_TOKEN" >> $OUTPUT_FILE
fi

# Get project info using the 'inspect' command instead of 'ls --json'
echo "Getting project information..."
PROJECT_NAME=$(basename $(pwd))
PROJECT_INFO=$(vercel project ls 2>/dev/null)

echo "Looking for project: $PROJECT_NAME"

# Get current project details
PROJECT_DETAILS=$(vercel project ls | grep "$PROJECT_NAME")
if [ -z "$PROJECT_DETAILS" ]; then
    echo "Warning: Couldn't find a project named '$PROJECT_NAME'." >> $OUTPUT_FILE
    echo "VERCEL_PROJECT_ID=<get_from_vercel_dashboard>" >> $OUTPUT_FILE
    echo "VERCEL_ORG_ID=<get_from_vercel_dashboard>" >> $OUTPUT_FILE
else
    # Extract project ID using vercel inspect
    echo "Found project. Getting details..."
    INSPECT_OUTPUT=$(vercel project inspect "$PROJECT_NAME" 2>/dev/null)
    
    # Extract Project ID
    PROJECT_ID=$(echo "$INSPECT_OUTPUT" | grep -o "ID: [a-zA-Z0-9_-]*" | cut -d' ' -f2)
    if [ -n "$PROJECT_ID" ]; then
        echo "VERCEL_PROJECT_ID=$PROJECT_ID" >> $OUTPUT_FILE
    else
        echo "VERCEL_PROJECT_ID=<get_from_vercel_dashboard>" >> $OUTPUT_FILE
    fi
    
    # Extract Org ID
    ORG_ID=$(echo "$INSPECT_OUTPUT" | grep -o "ORGANIZATION ID: [a-zA-Z0-9_-]*" | cut -d' ' -f3)
    if [ -n "$ORG_ID" ]; then
        echo "VERCEL_ORG_ID=$ORG_ID" >> $OUTPUT_FILE
    else
        echo "VERCEL_ORG_ID=<get_from_vercel_dashboard>" >> $OUTPUT_FILE
    fi
fi

# Get scope (team name or username)
SCOPE=$(vercel whoami)
echo "VERCEL_SCOPE=$SCOPE" >> $OUTPUT_FILE

echo ""
echo "✅ Vercel properties have been saved to $OUTPUT_FILE"
echo "Add these as secrets in your GitHub repository Settings → Secrets and variables → Actions"
echo "If any values are missing, you can find them in your Vercel dashboard under Project Settings"
