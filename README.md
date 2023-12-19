[![Build Release Deploy 🚀](https://github.com/bkd-mba-fbi/event-information/actions/workflows/buildReleaseDeploy.yml/badge.svg)](https://github.com/bkd-mba-fbi/event-information/actions/workflows/buildReleaseDeploy.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/1f04134a-e9eb-49ba-9aa4-c00d262e35a0/deploy-status)](https://app.netlify.com/sites/event-information/deploys)
# event-information
Display events from evento api to add this to entrance of a buildung or of a room.

# Parameter

mandatory parameters are `buildingId` or `roomId` and `instanceId`

## Options
- refresh: to get new occupancies from restApi in min (default 1min)
- color: filter to event color would you like to display on the screen

  ![image](https://github.com/bkd-mba-fbi/event-information/assets/41326409/6a88823c-82b8-4f0a-9c15-8813d5e6bfb1)
- headerColor: Color for the header (HEX without # in param) 
- siteChange: Interval to go to next site if more then 1 site in sec (default 3.5sec)

# Setup & Development

## Getting Started

Install the dependencies:

```
npm install
```

Copy [settings.example.js](../settings.example.js) to `public/settings.js` and adjust its contents.

Start the development server:

```
npm run dev
```
## Responsive Design

font-size and padding are calculatet bei screensize.
```
font-size: calc(1.3rem + 1.1vw)
padding: calc(0.1rem + 2vw);
```
if smaller than 850px: 
```
font-size: calc(0.8rem + 1.55vw)
```
