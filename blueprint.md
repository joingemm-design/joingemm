# GEMM Application Blueprint

## Overview

GEMM is a platform for creators to monetize their audience. It allows them to sell products, host events, and manage their brand from a single link-in-bio page.

## Implemented Features

### Core

*   **Authentication:** Users can sign up and log in using Google or email and password.
*   **Onboarding:** New users are guided through an onboarding process to set up their profile and username.
*   **Dashboard:** A central command center for users to manage their content and settings.

### Link-in-Bio

*   **Customizable Profile:** Users can customize their public profile with a display name, bio, and profile picture.
*   **Link Management:** Users can add, edit, and delete links on their profile.
*   **Theming:** Users can choose from a variety of themes to customize the look and feel of their profile.

### Events

*   **Public Event Page:** A beautifully designed, public-facing page (`/event/[id]`) for each event. It displays the event flyer, detailed information, and allows visitors to RSVP by selecting tickets and providing their name and email. The page is themed based on the creator's choices.
*   **Event Portal:** A beautiful, responsive dashboard (`/dashboard/events`) for users to manage all their events. It features powerful search and filtering capabilities (by status: all, active, passed).
*   **Advanced Event Creation:** A comprehensive, two-panel creation form (`/dashboard/events/new`) with a live mobile preview. It allows users to build detailed event pages with:
    *   Title, start/end dates and times, venue details, and rich text descriptions.
    *   Flyer image uploading to Firebase Storage.
    *   Creation of multiple, configurable ticket types with names, prices, and descriptions.
    *   Customizable themes (background, text, accent colors).
    *   Optional external links (Eventbrite, Posh, Website).
*   **Event Management Dashboard:** Each event has a dedicated management hub (`/dashboard/events/[eventId]`) with a modern, tabbed interface:
    *   **Overview:** Displays a summary of the event's key information and statistics.
    *   **Guestlist:** Fetches and displays a real-time list of all registered attendees (RSVPs) in a clean, tabular format.
    *   **Tickets:** Shows all configured ticket tiers for the event.
    *   **Settings:** A placeholder for future event editing and management capabilities.
*   **Robust Data Model:** A flexible and scalable data structure in Firestore (`EventData`, `Ticket`, `RSVP`) supports rich event details, ticketing, and attendee registration.

