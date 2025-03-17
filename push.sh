#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if commit message was provided as argument
if [ $# -eq 0 ]; then
  echo -e "${RED}Error: No commit message provided.${NC}"
  echo -e "Usage: ./push.sh \"Your commit message\""
  exit 1
fi

# Store the commit message from the first argument
commit_message="$1"

echo -e "${YELLOW}Starting push process...${NC}"

# Check if there are any changes to commit
if [[ -z $(git status -s) ]]; then
  echo -e "${YELLOW}No changes to commit.${NC}"
  exit 0
fi

# Show the changes that will be committed
echo -e "${YELLOW}Changes to be committed:${NC}"
git status -s

# Ask for confirmation
read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Push cancelled.${NC}"
  exit 0
fi

# Commit and push changes
echo -e "${YELLOW}Committing changes with message:${NC} $commit_message"
git add .
git commit -m "$commit_message"

echo -e "${YELLOW}Pushing to dev branch...${NC}"
git push origin dev

echo -e "${GREEN}Push complete! GitHub Actions workflow should be triggered.${NC}"
echo -e "${YELLOW}Check your GitHub repository for the workflow status.${NC}" 