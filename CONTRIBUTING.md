# Contributing to E-Commerce Store

Thank you for your interest in contributing! This document provides guidelines and steps for contributing.

## How to Contribute

### 1. Report Bugs

- Use the GitHub Issues tracker
- Include detailed steps to reproduce the bug
- Include expected and actual behavior
- Include your environment details (OS, Node.js version, etc.)

### 2. Suggest Features

- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Explain why it would be useful

### 3. Submit Pull Requests

1. Fork the repository
2. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages
   ```bash
   git commit -m "Add: description of your changes"
   ```
6. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. Create a Pull Request

## Development Setup

### Prerequisites

- Node.js v14+
- MongoDB
- npm or yarn

### Local Development

1. Clone your fork
   ```bash
   git clone https://github.com/your-username/E-Commerce-Store-with-Cart-Wishlist-Order-Tracking.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp ecomer.env .env
   # Edit .env with your settings
   ```

4. Start development server
   ```bash
   npm run dev
   ```

## Code Guidelines

### JavaScript Style

- Use ES6+ features where appropriate
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Commit Messages

Use clear and descriptive commit messages:

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Remove:` for removing code/features
- `Refactor:` for code refactoring

Example:
```
Add: user profile validation

- Add email format validation
- Add password strength check
- Add username length requirement
```

### File Structure

Follow the existing project structure:

- `controllers/` - Route handlers
- `models/` - Mongoose schemas
- `routes/` - API routes
- `middleware/` - Custom middleware

## Testing

- Test all API endpoints before submitting
- Use tools like Postman or Thunder Client
- Include test cases in your PR description if adding new features

## Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Changes have been tested locally
- [ ] No console errors or warnings
- [ ] Environment variables are documented
- [ ] README is updated if needed
- [ ] PR has a clear description of changes

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive environment

## Questions?

Feel free to open an issue for any questions about contributing.
