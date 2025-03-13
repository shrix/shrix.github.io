# Shrix Chat

Personal website and chat interface hosted at [shrix.com](https://shrix.com).

## Project Structure

This repository contains both the source code and the built static files for GitHub Pages deployment.

### Key Directories:
- `/app`: Next.js application source code
- `/components`: React components
- `/layouts`: Page layout components
- `/lib`: Utility functions and libraries
- `/public`: Static assets
- `/_next`, `/chat`, `/404.html`, `/index.html`: Generated files from the Next.js build

### Configuration Files:
- `next.config.js`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `jsconfig.json`: JavaScript configuration for the project
- `package.json`: Project dependencies and scripts
- `.nojekyll`: Prevents GitHub Pages from processing the site with Jekyll
- `CNAME`: Sets the custom domain for GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Deployment

The site is deployed to GitHub Pages using the `deploy` script in package.json, which:
1. Builds the Next.js application
2. Creates necessary files for GitHub Pages (.nojekyll, CNAME)
3. Copies the built files to the repository root for GitHub Pages deployment 