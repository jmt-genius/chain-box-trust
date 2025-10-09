# Boxity - QR Provenance Demo

A production-ready QR-based provenance tracking demo built with React, TypeScript, and TailwindCSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📋 Features

- **Home Page**: Hero section with catchy tagline and CTA
- **Admin Dashboard**: Create batches and generate QR codes
- **Log Event**: Record supply chain events with actors, roles, and notes
- **Verify**: View complete batch timeline with cryptographic proofs
- **Dark/Light Theme**: Toggle with pure black backgrounds in dark mode
- **Responsive Design**: Mobile-first, accessible UI

## 🎯 Demo Batches

The app comes pre-loaded with three demo batches:

1. **CHT-001-ABC** - VitaTabs 10mg (2 events)
2. **CHT-002-XYZ** - ColdVax (1 event)
3. **CHT-DEMO** - Generic Demo Product (2 events)

## 📖 Usage Guide

### For Judges / Demo

1. **Home Page** (`/`)
   - View the hero section
   - Click "Try it out" to navigate to Admin

2. **Admin** (`/admin`)
   - Create a new batch or use pre-loaded demo batches
   - Generate QR codes for batches
   - Download QR code images

3. **Log Event** (`/log-event`)
   - Select a batch (e.g., CHT-001-ABC)
   - Add actor details and event notes
   - Submit to append to the timeline

4. **Verify** (`/verify`)
   - Enter batch ID: `CHT-001-ABC`
   - Click "Get Log" to view full timeline
   - See events with timestamps, images, hashes, and ledger references

### Theme Toggle

Click the sun/moon icon in the navbar to toggle between light and dark themes. The preference is saved to localStorage.

### Reset Demo Data

To reset to original demo data, open browser console and run:

```javascript
localStorage.removeItem('boxity-batches');
```

Then refresh the page.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── Navbar.tsx    # Main navigation
├── contexts/
│   └── ThemeContext.tsx
├── lib/
│   ├── demoData.ts   # Demo batches and data management
│   └── utils.ts      # Utility functions
├── pages/
│   ├── Index.tsx     # Home page
│   ├── Admin.tsx     # Admin dashboard
│   ├── LogEvent.tsx  # Event logging
│   └── Verify.tsx    # Batch verification
└── App.tsx           # Main app with routing
```

## 🎨 Design System

- **Primary Color**: Blue (#4A9EFF)
- **Dark Theme**: Pure black backgrounds (#000000)
- **Components**: shadcn/ui with customized variants
- **Animations**: Framer Motion for smooth transitions

## 🔐 Features Detail

### QR Code Generation

QR codes are generated using the `qrcode` library and contain the batch ID. Users can download QR codes as PNG images.

### Cryptographic Proof

Each event generates:
- **Hash**: 64-character SHA256-like identifier
- **Ledger Reference**: Fake blockchain transaction ID (0x...)

### LocalStorage Persistence

All batch data is stored in localStorage under the key `boxity-batches`. This simulates backend persistence for demo purposes.

## 🌐 Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Responsive mobile-first design
- High contrast in dark mode

## 📦 Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **qrcode** - QR generation
- **React Router** - Navigation

## 🚢 Production Build

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 📝 Notes

- This is a demo application with no backend
- All data is stored in browser localStorage
- Images reference `/demo/` folder (placeholder paths)
- QR codes encode batch IDs as plain text

---

**Lovable Project**: https://lovable.dev/projects/2f6fa193-b859-47a0-8259-216c1c0e3996

Built with ❤️ using React + TypeScript + Vite
