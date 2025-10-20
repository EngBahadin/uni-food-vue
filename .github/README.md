# GitHub Actions Setup for UniFood

This document explains the GitHub Actions workflows configured for the UniFood Vue.js project.

## Workflows Overview

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**

- Tests on Node.js versions 20.x and 22.x
- Installs dependencies with `npm ci`
- Runs ESLint for code quality
- Performs TypeScript type checking
- Builds the project
- Runs security audit
- Uploads build artifacts

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**

- Push to `main` branch
- Manual workflow dispatch

**What it does:**

- Builds the project
- Deploys to GitHub Pages
- Sets up proper permissions for Pages deployment

### 3. Dependency Updates (`.github/workflows/dependency-updates.yml`)

**Triggers:**

- Weekly schedule (every Monday at 9 AM UTC)
- Manual workflow dispatch

**What it does:**

- Updates npm dependencies
- Creates a pull request with updated dependencies
- Checks for outdated packages

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. Save the settings

### 2. Repository Settings

Make sure your repository has the following settings:

- Actions are enabled
- Workflow permissions are set to "Read and write permissions"

### 3. Branch Protection (Recommended)

Set up branch protection rules for `main`:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select the CI workflow checks

## Workflow Files

- `ci.yml` - Continuous Integration
- `deploy.yml` - Continuous Deployment to GitHub Pages
- `dependency-updates.yml` - Automated dependency updates

## Customization

### Adding Tests

To add actual tests, install a testing framework:

```bash
npm install --save-dev vitest @vue/test-utils jsdom
```

Then update the test scripts in `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

### Environment Variables

If you need environment variables for your workflows, add them in:

- Repository Settings → Secrets and variables → Actions
- Use them in workflows with `${{ secrets.SECRET_NAME }}`

### Custom Deployment

To deploy to other platforms (Vercel, Netlify, etc.), modify the `deploy.yml` workflow or create additional deployment workflows.

## Monitoring

- Check workflow runs in the "Actions" tab of your repository
- Monitor build status and deployment logs
- Set up notifications for failed builds

## Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version compatibility
2. **Deployment fails**: Verify GitHub Pages settings
3. **Permission errors**: Check workflow permissions
4. **Dependency issues**: Review package-lock.json conflicts

### Getting Help

- Check GitHub Actions documentation
- Review workflow logs for specific error messages
- Ensure all required secrets are configured
