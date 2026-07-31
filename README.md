# Async Race

This is my SPA for the "Async Race" task. You can create cars, race them, and see who won.

**Score: ___ / 400**

**Live demo:** _add link after deploying_

## What I used

- React + TypeScript
- React Router (for Garage / Winners pages)
- Tailwind CSS
- The provided backend mock: https://github.com/mikhama/async-race-api

## How to run it

First run the backend (needs to stay running):

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

## Checklist ___/400 pts

- [x] Two views: Garage and Winners
- [x] Garage view has name creation panel, race buttons, and car list
- [x] Winners view has a table
- [x] State doesn't reset when switching pages/views
- [x] Can create a car (sends it to the server)
- [x] Can delete a car (sends it to the server)
- [x] Button that makes 100 random cars
- [x] Buttons to select/remove a car, disabled while it's racing
- [x] Winners show up in the table after a race
- [x] Winners table has car icon, name, wins, best time
- [x] Start engine button works and animates the car
- [x] Stop engine button works and resets the car
- [x] Start Race button (starts all cars on the page)
- [x] Reset Race button
- [x] Shows a winner popup at the end
- [x] Buttons disable/enable correctly depending on car state