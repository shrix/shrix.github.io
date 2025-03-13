#!/bin/bash

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "✅ gh-pages branch exists"
else
    echo "❌ gh-pages branch does not exist"
    echo "Creating gh-pages branch..."
    git checkout --orphan gh-pages
    git reset --hard
    touch index.html
    echo "Hello World" > index.html
    git add index.html
    git commit -m "Initial gh-pages commit"
    git push origin gh-pages
    git checkout main
fi

echo "Done!" 