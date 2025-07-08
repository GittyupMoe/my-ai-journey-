# Contributing to Fridge Chef App

Thank you for your interest in contributing to Fridge Chef App! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Provide detailed steps to reproduce the bug
- Include browser/device information
- Add screenshots if applicable

### Suggesting Features
- Check existing issues first
- Provide a clear description of the feature
- Explain the use case and benefits
- Consider implementation complexity

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (version 8 or higher)

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/fridge_chef_app.git
cd fridge_chef_app

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Use ES6+ features

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic class names

### File Structure
- Keep components in the `src` directory
- Use descriptive file names
- Group related files together
- Follow the existing project structure

## 🧪 Testing

### Manual Testing
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Verify all user flows work correctly
- Check for accessibility issues

### Code Quality
- Run `npm run lint` before committing
- Fix any linting errors
- Ensure code is readable and well-documented

## 🔧 Common Development Tasks

### Adding New Recipes
1. Add recipe data to the `recipes` array in `src/App.jsx`
2. Follow the existing recipe structure
3. Test the recipe matching algorithm
4. Update documentation if needed

### Adding New Ingredients
1. Add ingredients to `predefinedIngredients` in `src/App.jsx`
2. Categorize ingredients appropriately
3. Test ingredient selection functionality
4. Update the README if adding new categories

### Modifying AI Integration
1. Test API calls thoroughly
2. Handle error cases gracefully
3. Update prompt templates carefully
4. Verify JSON schema validation

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works on all screen sizes

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested on desktop browsers
- [ ] Tested on mobile devices
- [ ] All existing functionality works
- [ ] New functionality tested

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Operating System
   - Browser and version
   - Node.js version
   - npm version

2. **Steps to Reproduce**
   - Clear, step-by-step instructions
   - Expected vs actual behavior

3. **Additional Context**
   - Screenshots or screen recordings
   - Console errors
   - Network tab information

## 💡 Feature Requests

When suggesting features:

1. **Problem Statement**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed Solution**
   - How should this feature work?
   - Any technical considerations?

3. **Use Cases**
   - Provide specific examples
   - Consider edge cases

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check the README.md for setup and usage information

## 🎉 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors list

Thank you for contributing to Fridge Chef App! 🍳✨ 