[![Build Deploy test 🚀](https://github.com/bkd-mba-fbi/event-information/actions/workflows/BuildDeployTest.yml/badge.svg?branch=main)](https://github.com/bkd-mba-fbi/event-information/actions/workflows/BuildDeployTest.yml)
[![Netlify Test](https://api.netlify.com/api/v1/badges/02dcaf07-53c9-4b09-80b1-e7bcc0b8b330/deploy-status)](https://app.netlify.com/sites/event-information-test/deploys)
[![Build Release Deploy 🚀](https://github.com/bkd-mba-fbi/event-information/actions/workflows/buildReleaseDeploy.yml/badge.svg)](https://github.com/bkd-mba-fbi/event-information/actions/workflows/buildReleaseDeploy.yml)
[![Netlify Prod](https://api.netlify.com/api/v1/badges/1f04134a-e9eb-49ba-9aa4-c00d262e35a0/deploy-status)](https://app.netlify.com/sites/event-information/deploys)
# event-information
Display events from evento api to add this to entrance of a buildung or of a room.

# How to use

This module can be used to display buildings. For example, building entrances to display events in this building. It is possible to set a parameter using the event color (Evento tab lesson) so that only these events are displayed. It is also possible to create a room display if the roomId parameter is called in the URL.

If you are an Evento school of the Canton of Bern, you can use the module directly via the URL https://event-information.netlify.app. 

If not, you can download the [latest release](https://github.com/bkd-mba-fbi/event-information/releases) and install it on any web server. You must then configure the 3 properties in settings.js. In Evento OAuth you have to create a Public ConsumerType that has access to the Scope `Public` with the endpoint `GET /RoomReservation` on the `EndpointList`.

## Parameter

Mandatory parameter are `instanceId` 

if no `buildingId` or `roomId` param ist set the app will display a link list with every building and room for this instance > https://event-information-test.netlify.app/?instance=BsTest

### Options
- `refresh`: to get new occupancies from restApi in min (default 1min)
- `color`: filter to event color would you like to display on the screen (HEX without # in param) 

  ![image](https://github.com/bkd-mba-fbi/event-information/assets/41326409/6a88823c-82b8-4f0a-9c15-8813d5e6bfb1)
- `headerColor`: Color for the header (HEX without # in param) 
- `siteChange`: Interval to go to next site if more then 1 site in sec (default 3.5sec)

E.g.
- buildingId: https://event-information.netlify.app/?instance=BsTest&buildingId=1001&refresh=60&headerColor=22947f
- roomId: https://event-information.netlify.app/?instance=BsTest&roomId=10001&refresh=60&headerColor=4a6a24

# Auth

At startup, the module checks whether a valid token is present in the sessionStorage.evtToken. Valid means the exp has not expired and the instanceId of the token corresponds to the token and the navigatorlanguage corresponds to the token culture_info. If not, a GET is made to the following endpoint.

`${settings.authUrl}/Authorization/${param.instanceId}/Token?clientId=${settings.clientId}&redirectUrl=${location.href}&culture_info=${navigatorLanguage}&application_scope=Public`

If the consumer is registered in OAuth, a new accessToken is sent to the client, which reads the accessToken into the sessionStorage.evtToken.

# Content

## Param buildingId

Header: `Rooms.Building`

Table rows:
- `Occupancies.DateTimeFrom - Occupancies.DateTimeFrom` (format hh:mm)
- `Occupancies.Designation`
- `Occupancies.Floor`
- `Occupancies.Ressource`

## Param roomId

Header: `Rooms.Ressource Rooms.Building`

Table rows:
- `Occupancies.DateTimeFrom - Occupancies.DateTimeFrom` (format hh:mm)
- `Occupancies.Designation`

## Responsive Design

font-size and padding are calculated by screen size.
```
font-size: calc(1.3rem + 1.1vw)
padding: calc(0.1rem + 2vw);
```
if smaller than 850px: 
```
font-size: calc(0.8rem + 1.55vw)
```

# Branching, Development & Releasing

- The active development happens in the main branch.
- Uses temporary feature branches that are created from main and merged back into main.
- The naming scheme for feature branches is feature/1234-short-description (with 1234 being the issue number and short-description being summary of the purpose of the branch)
- For bugfixes the branch can can be named bug/1234-short-description.
- Commits should be atomic (i.e. a stable, independent unit of change – the repository should still build, pass tests, and generally function if rolled back). Squash commits if necessary.
- The developer creates a pull request for the feature branch and assigns a reviewer.
- Feature branches should be merged fast-forward, without merge commit.

## Release

1. Do a pull request from main to production.
2. Title semantic version number (E.g. 1.1.0)
3. Commit message only version number
4. New release created by action
5. if action finished generate auto relasee notes an save
<img width="239" alt="image" src="https://github.com/bkd-mba-fbi/event-information/assets/41326409/e47331ce-3065-498b-b1b6-f841d86b8500">

## Action on main branch

1. Build app 
2. change settings propertys for test
3. Deploy app ti gh_pages/dist folder
4. Netlify deploy to https://event-information-test.netlify.app/

## Action on production branch

1. Build app 
2. change settings propertys for production
3. create zip file
4. Deploy app ti gh_pages/dist folder 
5. Create Release with tag COMMIT_SHORT_SHA 
6. Upload zip file to Release
7. Netlify deploy to https://event-information.netlify.app/

# Setup & Development

## Getting Started

Install the dependencies:

```
npm install
```

Copy [settings.example.js](settings.example.js) to `settings.js` and adjust its contents.

Start the development server:

```
npm run dev
```
