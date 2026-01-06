# Kaan Koç Portfolio Website

Modern, bilingual (Turkish/English) portfolio website built with Next.js, Sanity CMS, and Tailwind CSS.

## Features

- 🌐 **Bilingual Support**: Turkish and English with easy language switching
- 🎨 **Modern Design**: Yeditepe Blue (#003a70) theme with dark mode support
- 📱 **Fully Responsive**: Works perfectly on all devices
- ✨ **Smooth Animations**: Framer Motion for premium user experience
- 📝 **CMS Integration**: Sanity.io for easy content management
- 💬 **Contact Form**: Built-in contact form with chat bubble
- 🎯 **SEO Optimized**: Proper meta tags and semantic HTML

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion 11
- **CMS**: Sanity.io
- **Internationalization**: next-intl
- **Fonts**: Google Fonts (Anton + Inter)

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. A Sanity.io account ([Sign up here](https://www.sanity.io/get-started))
3. (Optional) A Crisp.chat account for live chat

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Sanity**:
   - Create a new project at [sanity.io](https://www.sanity.io/manage)
   - Copy `.env.local.example` to `.env.local`
   - Add your Sanity project ID and dataset name

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` with your values:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET`: Usually "production"
   - `NEXT_PUBLIC_CRISP_WEBSITE_ID`: (Optional) Your Crisp chat ID

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Access the site**:
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Adding Content

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Log in with your Sanity credentials
3. Add content for:
   - **Projects**: Your portfolio projects
   - **Experience**: Work experience
   - **Education**: Educational background
   - **Certificates**: Certifications and achievements

All content fields support both Turkish and English!

## Project Structure

```
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.js      # Root layout with fonts & i18n
│   │   ├── page.js        # Main homepage
│   │   └── admin/         # Sanity Studio route
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.jsx
│   ├── Hero.jsx
│   ├── Timeline.jsx
│   ├── ProjectGallery.jsx
│   ├── CertificateWall.jsx
│   ├── ContactSection.jsx
│   ├── ChatBubble.jsx
│   └── LanguageSwitcher.jsx
├── sanity/
│   ├── schemas/          # Content schemas
│   └── lib/              # Sanity client & utilities
├── messages/             # i18n translations
│   ├── tr.json          # Turkish
│   └── en.json          # English
└── lib/                 # Utility functions
```

## Customization

### Colors

Edit `tailwind.config.js` to change the Yeditepe Blue theme or add your own colors.

### Fonts

Fonts are configured in `app/[locale]/layout.js`. You can change Anton and Inter to any Google Fonts.

### Crisp Chat

To enable Crisp.chat, replace `YOUR_WEBSITE_ID` in `app/[locale]/layout.js` with your actual Crisp Website ID.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js.

## License

MIT

## Author

Kaan Koç
