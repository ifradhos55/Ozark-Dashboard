# Ozark LMS Dashboard

A lightweight, React-based Learning Management System (LMS) dashboard featuring a clean, Apple-inspired interface. This application provides distinct workflows for students and instructors to manage courses, assignments, quizzes, and schedules. This is merely a demo, the real project is written using ASP .NET and C#

---

## Core Features

### For Instructors
* **Course Management**: Create, edit, and delete courses with unique codes and terms.
* **Module Organization**: Structure course content into modules (e.g., Weekly units).
* **Content Authoring**: Add pages, file uploads, and discussion threads to modules.
* **Assessment Creation**:
    * **Assignments**: Create file-based assignments with custom due dates and attempt limits.
    * **Quizzes**: Build interactive quizzes with multiple-choice questions and automated grading.
* **Task Tracking**: Manage administrative tasks with priority levels (High, Medium, Low).

### For Students
* **Dashboard Overview**: View active courses and upcoming deadlines at a glance.
* **Module Access**: Navigate through structured course materials and resources.
* **Interactive Learning**: Take quizzes and submit assignments through a streamlined interface.
* **Personal Schedule**: Add personal events and track task deadlines.

---

## Technical Stack

* **Frontend Library**: React 18.2.0 (via ESM)
* **Styling**: Tailwind CSS
* **Icons**: Lucide-React
* **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
* **Data Persistence**: Browser `localStorage`
* **Compilation**: Babel Standalone (JSX support in-browser)

---

## Project Structure

The application is architected as a single-page application (SPA) with the following component categories:

### UI Components
* **Button**: Multi-variant action component (Primary, Accent, Secondary, Ghost, Danger).
* **Input/Select**: Styled form elements with integrated label handling.
* **ModalOverlay**: A standardized container for all pop-up interactions including enter/exit animations.

### Domain Modals
* **AddEventModal**: Personal schedule management.
* **CreateCourseModal / EditCourseModal**: Course metadata management.
* **AddAssignmentModal**: File-based assessment creation.
* **CreateQuizModal**: Dynamic form for generating multiple-choice questions.

### View States
* **AuthScreen**: Handles user registration and role-based login (Student vs. Instructor).
* **Dashboard**: The primary landing area displaying course cards and global metrics.
* **CourseView**: Detailed view for specific course content and instructor tools.

---

## Installation and Usage

1. **Clone the Repository**: Save the HTML file to your local machine.
2. **Environment**: No build step is required. The project fetches dependencies via CDN.
3. **Run**: Open the file in any modern web browser.
4. **Local Storage**: Data persists in the browser. Clearing site data/cache will reset the dashboard to the initial state.

---

## Design Specifications

* **Typography**: System-native sans-serif stack for high legibility.
* **Color Palette**: Slate-based neutrals with `#2D3B45` (Primary) and `#BF2604` (Accent) for branding.
* **Dark Mode**: Full support via Tailwind's `dark` class, responding to user system preferences.
* **Animations**: CSS-based transitions for modal scaling and color shifts.
