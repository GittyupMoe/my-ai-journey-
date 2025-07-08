# Deployment Guide

This guide covers how to deploy the Fridge Chef App to various platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
1. **Fork/Clone** the repository to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
3. **Configure Environment Variables** (Optional):
   - Add `VITE_GEMINI_API_KEY` with your Gemini API key
   - Update the API key references in `src/App.jsx`
4. **Deploy**: Vercel will automatically build and deploy your app

### Netlify
1. **Fork/Clone** the repository to your GitHub account
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Choose your repository
3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment Variables** (Optional):
   - Add `VITE_GEMINI_API_KEY` with your Gemini API key
5. **Deploy**: Netlify will build and deploy your app

### GitHub Pages
1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Configure GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages"
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch or `main` branch with `/docs` folder
3. **Set up GitHub Actions** (Optional):
   - Create `.github/workflows/deploy.yml` for automatic deployment

## 🔧 Environment Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/fridge_chef_app.git
cd fridge_chef_app

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env.local
# Edit .env.local with your API key

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 API Key Configuration

### Option 1: Environment Variables (Recommended)
1. **Create `.env.local` file**:
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
2. **Update `src/App.jsx`**:
   ```javascript
   const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
   ```

### Option 2: Direct Configuration
1. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Update `src/App.jsx`**:
   ```javascript
   const apiKey = "your_api_key_here";
   ```

### Option 3: Runtime Configuration
1. **Create a config file** that users can edit:
   ```javascript
   // config.js
   export const config = {
     geminiApiKey: "your_api_key_here"
   };
   ```

## 📱 Platform-Specific Instructions

### Vercel
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Netlify
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x or higher

### GitHub Pages
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` or `main`
- **Folder**: `/docs` (if using main branch)

### Firebase Hosting
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```
3. **Configure**:
   - Public directory: `dist`
   - Single-page app: Yes
4. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## 🔒 Security Considerations

### API Key Security
- **Never commit API keys** to version control
- **Use environment variables** for production
- **Rotate keys regularly** for security
- **Set up API key restrictions** in Google Cloud Console

### CORS Configuration
- **Configure allowed origins** in your deployment platform
- **Set up proper headers** for API requests
- **Test cross-origin requests** thoroughly

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images and assets
# Use WebP format for images
# Compress SVG files
```

### Runtime Optimization
- **Enable gzip compression** on your hosting platform
- **Set up CDN** for static assets
- **Configure caching headers** appropriately

## 🧪 Testing Before Deployment

### Local Testing
```bash
# Run linting
npm run lint

# Build and test
npm run build
npm run preview

# Test all features
# - Ingredient selection
# - Recipe matching
# - AI integration (if API key configured)
# - Responsive design
```

### Cross-Browser Testing
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Edge**: Latest version
- **Mobile browsers**: iOS Safari, Chrome Mobile

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+ for React 19
```

#### API Key Issues
- **Check environment variable** is set correctly
- **Verify API key** is valid and has proper permissions
- **Test API calls** in browser console

#### Deployment Issues
- **Check build logs** for errors
- **Verify build output** in `dist` folder
- **Test locally** before deploying

### Getting Help
- **Check the README** for setup instructions
- **Review the CONTRIBUTING** guide
- **Open an issue** on GitHub
- **Check deployment platform** documentation

## 📈 Monitoring and Analytics

### Performance Monitoring
- **Set up Google Analytics** for user tracking
- **Monitor API usage** in Google Cloud Console
- **Track error rates** and performance metrics

### User Feedback
- **Add feedback forms** to the app
- **Monitor GitHub issues** for bug reports
- **Track user engagement** metrics

---

**Happy Deploying! 🚀** 