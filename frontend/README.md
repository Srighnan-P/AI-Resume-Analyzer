# AI Resume Processor - Frontend

A modern, responsive frontend built with Next.js, Tailwind CSS, and shadcn/ui for processing resumes with AI assistance.

## 🚀 Features

- **Modern UI**: Built with shadcn/ui components for a polished, accessible interface
- **Responsive Design**: Fully responsive design that works on all devices
- **File Upload**: Drag & drop or click to upload PDF resumes
- **Real-time Processing**: Live updates during resume processing
- **TypeScript**: Fully typed for better development experience
- **Dark/Light Mode**: Automatic theme switching support

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript
- **Build Tool**: Turbopack (Next.js 15)

## 📦 Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── form.tsx
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Page footer
│   ├── resume-upload.tsx # Main upload component
│   └── loading-spinner.tsx # Loading component
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Components

### ResumeUpload
The main component for handling file uploads and displaying processing results.

**Features:**
- PDF file validation
- Upload progress indication
- Error handling
- Results display

### UI Components
All UI components are from shadcn/ui and include:
- `Button` - Various button variants
- `Card` - Content containers
- `Input` - Form inputs
- `Label` - Form labels
- `Textarea` - Multi-line text input
- `Select` - Dropdown selections

## 🔧 Configuration

The project uses several configuration files:

- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend is configured to connect to the backend API at `http://localhost:8000`. Make sure your backend server is running for full functionality.

### Endpoints Used:
- `POST /upload` - Upload and process resume files

## 🎨 Styling

The project uses Tailwind CSS v4 with the following features:
- CSS-in-JS with `@tailwindcss/postcss`
- Custom design system via shadcn/ui
- Responsive design utilities
- Dark mode support (ready to implement)

## 🧩 Adding New Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dropdown-menu
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Type Safety

All components are written in TypeScript with proper type definitions for:
- Props interfaces
- API responses
- Event handlers
- State management

## 🚀 Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

Or deploy to platforms like Vercel, Netlify, or any Node.js hosting service.

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Add proper error handling
4. Test responsive design
5. Update documentation as needed

## 📄 License

This project is part of the AI Resume Processor application.
