# Google Map API Test

# Project Description

Given the geographical coordinates for the starting point, intermediate stops,
and ending point, this project is a simple web page that utilizes the Google Maps API
to navigate a route. The page should display the estimated time to reach each upcoming
stop.

# Tech stack
- React
- TypeScript
- Vite

# Get it working

- clone the repo
- `pnpm install`
- Create `.env` file and add `VITE_GOOGLE_MAP_API_KEY = YOUR_KEY` making sure to replace `YOUR_KEY` with your actual Google Maps API Key. Refer to `.env.example` file
- Spin up local development server with `pnpm run dev`
- Open the URL which should look something like `http://localhost:5174/`