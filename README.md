# Employee Dashboard - Arabic RTL

A modern, responsive dashboard for managing employee deals data with Arabic RTL support.

## 🚀 Features

- **Arabic RTL Interface** - Full right-to-left layout support
- **English Numbers** - All numbers displayed in English numerals (1,2,3...)
- **Real-time Data** - Live data from n8n API integration
- **Interactive Charts** - Bar charts and line charts for data visualization
- **Advanced Table** - Search, filter, and sorting capabilities
- **Multi-step Forms** - Deal entry with validation and API submission
- **Mobile Responsive** - Optimized for all device sizes
- **Ngrok Ready** - Configured for ngrok deployment

## 🛠️ Technologies

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Recharts** for data visualization
- **TanStack Table** for advanced table functionality
- **Lucide React** for icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## 🌐 Ngrok Deployment

### Step 1: Build the Application
```bash
# For Linux/Mac
npm run build

# For Windows (using batch file)
deploy.bat
```

### Step 2: Serve the Application
```bash
# Option 1: Using npm script
npm run serve

# Option 2: Using npx
npx vite preview --host 0.0.0.0 --port 4173

# Option 3: Using serve (install globally first)
npm install -g serve
serve -s dist -l 4173
```

### Step 3: Start Ngrok
```bash
# Install ngrok first if not installed
# Then run:
ngrok http 4173
```

### Step 4: Access Your Application
Your ngrok URL will look like:
```
https://fitting-singularly-heron.ngrok-free.app
```

## 📊 API Integration

The application integrates with n8n webhooks:

- **Data Fetching**: `https://n8n.srv936449.hstgr.cloud/webhook-test/5e076f7c-b35e-49ed-a46e-82c7441b43df`
- **Form Submission**: Multiple webhooks for different form steps

## 🎨 Features

### Dashboard Page
- Real-time summary cards with totals
- Interactive bar charts for daily/monthly deals
- Line chart for amount trends over time
- Advanced data table with search and filtering
- Responsive design for mobile devices

### Deal Form Page
- Multi-step form for entering new deals
- WhatsApp verification system
- Email confirmation workflow
- API integration for data submission
- Arabic interface with RTL support

## 🔧 Configuration

### Number Formatting
All numbers in the application are displayed using English numerals (1, 2, 3...) instead of Arabic numerals (١, ٢, ٣...):

```javascript
// Summary cards
number.toLocaleString('en-US')

// Table cells
info.getValue()?.toLocaleString('en-US') || 0
```

This ensures consistency and better readability for international users while maintaining the Arabic RTL interface.

### Ngrok Configuration
The application is configured to work with ngrok through:
- Relative paths (`base: './'`)
- Host binding (`host: '0.0.0.0'`)
- Manual chunk splitting for better performance
- **Allowed hosts**: Configured to accept `fitting-singularly-heron.ngrok-free.app`

**For Different Ngrok Domains:**
If you get a "blocked request" error with a different ngrok domain, add it to `vite.config.ts`:

```typescript
server: {
  allowedHosts: [
    'your-ngrok-domain.ngrok-free.app',
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ],
}
```

## 📱 Mobile Support

- Responsive navigation that adapts to screen size
- Touch-friendly buttons and form elements
- Horizontal scrolling for data tables
- Optimized layouts for mobile devices

## 🚀 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build
- `npm run build-serve` - Build and serve in one command
- `npm run preview` - Preview production build

## 📋 Requirements

- Node.js 18+
- npm or yarn
- ngrok (for deployment)

## 📞 Support

For issues or questions, please check the code comments and documentation.
# codex-college
