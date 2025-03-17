#!/bin/bash

mkdir -p bkup

# Determine which version number to use
version=1
if [ -d "bkup/v1" ]; then
    version=2
fi
if [ -d "bkup/v2" ]; then
    version=3
fi

# Rotate existing backups (v3 -> v2 -> v1)
if [ -d "bkup/v1" ]; then
    rm -rf bkup/v1
fi

if [ -d "bkup/v2" ]; then
    mv bkup/v2 bkup/v1
fi

if [ -d "bkup/v3" ]; then
    mv bkup/v3 bkup/v2
fi

mkdir -p bkup/v3

# Copy essential files and directories
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
    bkup/v3/

echo "Backup completed successfully in bkup/v$version" 