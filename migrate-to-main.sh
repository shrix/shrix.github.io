#!/bin/bash

# Create a temporary directory
mkdir -p tmp_gh_pages

# Checkout gh-pages branch files
git checkout gh-pages -- .nojekyll CNAME index.html chat

# Build the Next.js app
npm run build

# Copy the built Next.js app to the root
cp -r out/* .
cp out/.nojekyll .

# Ensure CNAME file exists
echo "shrix.com" > CNAME

# Add all files to git
git add .

# Commit the changes
git commit -m "Migrate from gh-pages to main branch"

# Push the changes
git push

echo "Migration completed successfully!" 