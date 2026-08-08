# Async Race

- Live demo: https://epam-race-game.netlify.app/
- Estimated score: 360 / 400

This is my frontend SPA for the Async Race task. It lets users create cars, edit them, start and stop engines, race them, and view the winners table.

## What I used

- React + TypeScript
- React Router for Garage / Winners navigation
- Vite
- The provided backend mock: https://github.com/mikhama/async-race-api

## How to run it

First run the backend (it needs to stay running):

```bash
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm start
```

Then run this project:

```bash
npm install
npm run dev
```

## Checklist 360/400 pts

### 🚀 UI Deployment

- [x] Deployment Platform: UI is deployed on Netlify.

### ✅ Requirements to Commits and Repository

- [x] Commit guidelines compliance: commits follow a clear structure.
- [x] Checklist included in README.md.
- [x] Score calculation included at the top of the README.
- [x] UI deployment link included in the README.

### Basic Structure (80 points)

- [x] Two Views
- [x] Garage View Content
- [x] Winners View Content
- [x] Persistent State

### Garage View (90 points)

- [ ] Car Creation And Editing Panel. CRUD Operations
- [x] Color Selection
- [x] Random Car Creation
- [x] Car Management Buttons
- [x] Pagination
- [ ] Empty Garage handling

### Winners View (50 points)

- [x] Display Winners
- [ ] Pagination for Winners
- [x] Winners Table
- [ ] Sorting Functionality

### Race (170 points)

- [x] Start Engine Animation
- [x] Stop Engine Animation
- [x] Responsive Animation
- [x] Start Race Button
- [x] Reset Race Button
- [x] Winner Announcement
- [x] Button States
- [x] Actions during the race

### 🎨 Prettier and ESLint Configuration (10 points)

- [x] Prettier Setup
- [ ] ESLint Configuration
