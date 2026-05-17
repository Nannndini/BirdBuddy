# BirdBuddy 🦜✨

🚀 **Live Demo:** [https://birdbuddy-main-fq11igsv4-nannndinis-projects.vercel.app](https://birdbuddy-main-fq11igsv4-nannndinis-projects.vercel.app)
An immersive, AI-powered nature identifier built with React 19, React Three Fiber, and Vite. Designed as a premium mobile-first field journal for modern explorers.

## Features
- **AI Bird Identification**: Drag & drop or take photos to identify species instantly using an iNaturalist-inspired API layer.
- **Immersive 3D Environment**: Powered by React Three Fiber, featuring a gorgeous ambient forest scene with floating leaves, a dynamic firefly field, and bloom post-processing.
- **My Field Journal**: Collect and categorize sightings with rarity badges, milestone unlock banners, and a stunning collection grid.
- **Interactive Map & Alerts**: Track community sightings in real-time on a custom dark mode Leaflet map, and receive nearby rare alerts.
- **Nature-Inspired Design System**: Built with deep forest greens, neon accents, and sleek glassmorphism UI elements tailored for a premium mobile feel.

## Tech Stack
- React 19
- Vite
- React Three Fiber / Drei / Postprocessing
- Framer Motion (Page Transitions & Micro-interactions)
- React Router DOM
- React Leaflet

## Local Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

## Deployment (Vercel)

1. Ensure the Vercel CLI is installed: \`npm i -g vercel\`
2. Run \`vercel --prod\` in the project root.
3. The project includes a \`vercel.json\` to rewrite all routes to \`index.html\` for proper SPA routing, and \`vite.config.ts\` is configured with a proxy for any backend API requests.

---
*Created for the 8xengineer.com hackathon.*
