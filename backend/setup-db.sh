#!/bin/bash

# Todo App Database Setup Script
# This script helps set up the PostgreSQL database for the todo app

echo "🚀 Todo App Database Setup"
echo "=========================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first:"
    echo "  - Mac: brew install postgresql"
    echo "  - Ubuntu: sudo apt-get install postgresql"
    echo "  - Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Prompt for PostgreSQL password
read -sp "Enter your PostgreSQL password (default is 'postgres'): " PGPASSWORD
echo ""
PGPASSWORD=${PGPASSWORD:-postgres}
export PGPASSWORD

# Database configuration
DB_NAME="todoapp"
DB_USER="postgres"

echo ""
echo "Creating database '$DB_NAME'..."

# Create database (ignore error if already exists)
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "⚠️  Database may already exist (this is OK)"
fi

echo ""
echo "Creating tables from schema..."

# Run schema file
psql -U $DB_USER -d $DB_NAME -f sql/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Tables created successfully"
else
    echo "❌ Failed to create tables"
    exit 1
fi

echo ""
echo "Verifying tables..."
psql -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env: cp .env.example .env"
echo "2. Edit .env and update DATABASE_URL with your password"
echo "3. Install dependencies: npm install"
echo "4. Start the server: npm start"
echo ""
