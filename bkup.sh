#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p bkup

# Rotate existing backups
if [ -d "bkup/v2" ]; then
    rm -rf bkup/v3
    mv bkup/v2 bkup/v3
fi

if [ -d "bkup/v1" ]; then
    mv bkup/v1 bkup/v2
fi

# Create new backup directory
mkdir -p bkup/v1

# Copy essential files and directories
# Copying only the necessary files, avoiding node_modules, .next, etc.
cp -r \
    app \
    components \
    layouts \
    lib \
    public \
    .gitattributes \
    .gitignore \
    jsconfig.json \
    next.config.js \
    package.json \
    package-lock.json \
    postcss.config.js \
    push.sh \
    readme.md \
    tailwind.config.js \
    bkup/v1/

echo "Backup completed successfully!"
echo "Latest version is in bkup/v1/"
echo "Previous version is in bkup/v2/ (if it exists)"
echo "Oldest version is in bkup/v3/ (if it exists)" 