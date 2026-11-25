# Northbridge Talent

A responsive recruitment homepage for a Mumbai agency, built with React, TypeScript, Vite and Tailwind CSS v4.

## Run locally

```powershell
npm install
npm run dev
```

Check and build the project:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Demo content and agency details

Edit `src/data/` to update the example jobs, services, process steps, FAQs, testimonials and agency details. `src/data/site.ts` is the source for the agency name, contact details and tagline used by the React components.

The job applications, CV upload, employer enquiry and newsletter forms are front-end demonstrations. They validate input and log submissions to the browser console; they do not send or store information. Replace them with approved API endpoints before launch.

## Photos

Replace `src/assets/images/hero.jpg`, `employers.jpg` and `job-seekers.jpg` with approved, locally stored photos. Keep each image's alt text accurate in its component. The hero image is loaded eagerly; the other photos are lazy-loaded.

## Components and motion

The project uses the free Aceternity Bento Grid component in `src/components/ui/bento-grid.tsx`. Other visual patterns are original implementations; no Pro component code, copy or imagery is included. `src/components/ui/button.tsx` is a shadcn/ui button primitive.

Motion handles interface transitions and reveals. GSAP is limited to the hero intro, the How It Works tracing line, and Lenis/ScrollTrigger synchronization. Reduced-motion preferences disable smooth scrolling and optional movement.

## Before launch

Replace all demo jobs, statistics and testimonials with approved agency data. Confirm the contact details, metadata, canonical URL, social preview image, structured data, robots file and sitemap for the production domain. Connect the forms to a secure backend and review privacy and file-upload handling.
