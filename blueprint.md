# GEMM Application Blueprint

## Overview

GEMM is a comprehensive platform for creators to manage their digital presence. It offers a suite of tools for creating a link-in-bio page, publishing events, opening shops, and more. This blueprint outlines the application's structure, features, and design principles.

## Project Structure

The application is built with Next.js and follows the App Router paradigm. Key directories include:

- `/app`: Main directory for application routing and core components.
- `/app/dashboard`: Houses the user dashboard and related sub-pages.
- `/components`: Contains reusable UI components.
- `/hooks`: Holds custom React hooks, such as `useAuth` and `useIsMobile`.
- `/lib`: Includes utility functions, Firebase configuration, and database interaction logic.

## Implemented Features

### Core Features

- **Authentication:** Users can sign up and log in using Google authentication, with a fallback to email/password.
- **Dashboard:** A central hub for users to access all of GEMM's features. The dashboard provides quick access to various modules and actions.
- **Link-in-Bio Editor:** A two-panel editor for creating and customizing a link-in-bio page.
- **Event Publisher:** A two-panel editor for creating and managing events.
- **Shop Builder:** A two-panel editor for setting up and managing online shops.

### Custom Hooks

- **`useIsMobile` (`hooks/useIsMobile.ts`):** A custom client-side hook to detect mobile screen sizes. It checks if `window.innerWidth` is less than or equal to a given breakpoint (defaulting to 768px) and is designed for use in client components.

### Dashboard Layout

A consistent layout (`app/dashboard/layout.tsx`) is applied to all dashboard pages, providing a seamless user experience. This layout includes:

- **Sidebar Navigation:** A persistent sidebar with links to all major dashboard sections.
- **User Profile:** Displays the user's avatar, name, and email.
- **Logout Functionality:** A prominent logout button.
- **Responsive Design:** The sidebar collapses into a mobile-friendly menu on smaller screens.

### Dashboard Pages and Actions

The main dashboard page (`app/dashboard/page.tsx`) features a set of quick actions and workspace modules, each linked to a specific route:

- **Quick Actions:** `Find My Tickets`, `Billing & Payouts`, `Data & Analytics`, `Go Home`, `Help & Support`.
- **Workspace Modules:** `Link-in-Bio`, `Publish Event`, `Manage Events`, `Discover Events`, `Publish Shop`, `Commerce`, `QR Codes`, `Quick Media`.

## Design and Styling

- **Component Library:** The application uses a custom component library with a variety of modern UI elements.
- **Styling:** The application features a modern aesthetic with a clean layout, vibrant color palette, and depth effects.
- **Accessibility:** The application adheres to A11Y standards.

### Responsive Dashboard & Editors

To enhance the user experience on mobile devices, the dashboard and editor pages have been made fully responsive using the `useIsMobile` hook.

- **Dashboard (`/dashboard`):** The "Quick Actions" and "Workspace Modules" grids, which are multi-column on desktop, dynamically switch to a single-column layout on mobile screens for improved readability and usability.

- **Editor Pages (`/links`, `/events/new`, `/shop/new`):
    - **Dynamic Layout:** On screens wider than 768px, the editors feature a two-column layout with the main editor on the left and a live phone preview on the right.
    - **Mobile-First Approach:** On screens 768px or narrower, the layout switches to a single column, giving full width to the editor controls. The live phone preview is hidden to maximize space for content creation, and the bottom action bar adjusts to the full width of the screen.
