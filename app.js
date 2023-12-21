const evtToken = 'evtToken'
var settings = window.eventInformation.settings;
// browser-language
let navigatorLanguage = navigator.language.split('-')[0] === 'fr' ? 'fr-CH' : 'de-CH';

//mandatory param
var buildingId = getParameterByName('buildingId');
var instanceId = getParameterByName('instance');
var roomId = getParameterByName('roomId');

//options
var refresh = getParameterByName('refresh');
var color = getParameterByName('color');
var headerColor = getParameterByName('headerColor');
var siteChange = getParameterByName('siteChange');

var rooms = null;

//scroll start
var scrollPosition = 0;

/**
 * stores access token
 * @param {object} value the value to store
 */
function setAccessToken(value) {
  sessionStorage.setItem(evtToken, value);
}

/**
 * reads evtToken
 */
function getAccessToken() {
  let item = sessionStorage.getItem(evtToken);

  return item !== undefined ? item : null;
}

/**
  * get an URL-parameter
  * taken from https://stackoverflow.com/q/901115#answer-901144
  * @param {string} name the name of the parameter
  * @param {string} url the URL (defaults to current URL)
  */
function getParameterByName(name, url) {

  if (typeof url !== 'string') {
    url = window.location.href;
  }

  name = name.replace(/[[\]]/g, '\\url');

  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


/**
* return true if there is a valid token in the localStorage
*/
function isLoggedIn() {
  let accessToken = getAccessToken();
  let tokenExpire = accessToken === null ? null : parseJWT(accessToken).exp * 1000;

  if (accessToken === null || (tokenExpire !== null && Date.now() >= tokenExpire)) {
    return false;
  }
  let payload = parseJWT(accessToken);

  // only return true if instanceId and culture are correct
  return instanceId === payload.instance_id && payload.culture_info === navigatorLanguage;
}

/**
 * parse accessToken and return the JWT payload
 * @param {string} accessToken the accessToken
 */
function parseJWT(accessToken) {
  return JSON.parse(atob(accessToken.split('.')[1]));
}

/**
 * save the OAuth token if there is one in the URL 
 */ 
function checkToken() {
  let accessToken = getParameterByName('access_token');

  if (accessToken !== null) {
    setAccessToken(accessToken);
    if (location.href.indexOf('?access_token') > 0) {
      location.replace(location.href.split('?')[0]);
    } else {
      location.replace(location.href.substring(0, location.href.indexOf('&access_token')));
    }

  }
}

/**
 * return resolved promise if there is a valid token
 * get a new accesToken otherwise
 */
function autoCheckForLogin() {
  if (isLoggedIn()) {
    return Promise.resolve();
  }

  // get a new token from the OAuth server
  let url = `${settings.authUrl}/Authorization/${instanceId}/Token?clientId=${settings.clientId}&redirectUrl=${location.href}&culture_info=${navigatorLanguage}&application_scope=Public`;

  location.replace(url);
  return new Promise(() => { }); // never resolve so no error-message gets shown
}

/**
 * Scroll if events table bigger then scrollPosition
 * formula: scrollPosition + screen.availHeight - header.height
 * if param siteChange > 0 use this vor interval else 3.5sec
 */
function scroll() {
  siteChange = siteChange > 0 ? siteChange * 1000 : 3500;
  setInterval(() => {
    scrollPosition = document.getElementById('events').getBoundingClientRect().height <= scrollPosition ? 0 : (scrollPosition + screen.availHeight) - (document.getElementById('header').getBoundingClientRect().height + 300);
    window.scrollTo(0, scrollPosition);
  }, siteChange);

}

/**
 * 
 * @param {string} url 
 * @returns response as json
 * get api data
 * token are set bei getAccessToken()
 */
async function getData(url) {
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'CLX-Authorization': 'token_type=urn:ietf:params:oauth:token-type:jwt-bearer, access_token=' + getAccessToken()
    }
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * 
 */
function getRoomReservation() {

  autoCheckForLogin();
  let now = new Date();
  let from = String(now - (60000 * 5));
  let to = String(now.setHours(23));
  from = from.substring(0, 10);
  to = to.substring(0, 10);

  getData(settings.restUrl + `/RoomReservation/Rooms/Occupancies/?filter.DateTimeFrom=${from}&filter.DateTimeTo=${to}&sort=DateTimeFrom.asc`) 
    .then((data) => {

      var table = document.getElementById('events');

      //Remove every row
      document.querySelectorAll('tr').forEach((tr) => {
        console.log()
        tr.remove();
      });

      data.forEach(element => {

        var displayColor = color === null ? element.DisplayColor : '#' + color;
        console.log(displayColor);
        var roomsFiltered = rooms.filter(r => r.Id === element.ResourceId);
        if (roomsFiltered.length > 0 && displayColor === element.DisplayColor) {

          // Create an empty <tr> element and add it to the 1st position of the table:
          var row = table.insertRow();
          // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
          // Add some text to the new cells:
          var time = row.insertCell(0);
          time.innerHTML = element.DateTimeFrom.split('T')[1].substring(0, 5) + ' - ' + element.DateTimeTo.split('T')[1].substring(0, 5);
          time.classList.add('medium');
          var designation = row.insertCell(1);
          designation.innerHTML = element.Designation;
          designation.classList.add('large');
          if (rooms.length >= 1) {
            var floor = row.insertCell(2);
            floor.classList.add('small');
            floor.innerHTML = roomsFiltered[0].Floor;
            var room = row.insertCell(3);
            room.classList.add('small');
            room.innerHTML = element.Ressource;
          }

          document.getElementById('events').style.marginTop = document.getElementById('header').getBoundingClientRect().height + 'px';
        }

      });

    });
}


/**
 * Start Application
 * 
 * 1. Check Param 
 * 2. checkToken in url
 * 3. get Login
 * 4. Get '/RoomReservation/Rooms/'
 * 5. set headerColor by param
 * 6. if buildingId in param filter rooms for building else filter roomId set header innerHTML
 * 7. getRoomReservation()
 * 8. scroll()
 * 9. refresh getRoomReservation() by param refresh if set or every 60sec
 */
if ((buildingId === null || roomId === null) && instanceId === null) {
  window.alert('Param instanceId and buildingId or roomId must be set: ' + location.host + '?instance={id}&buildingId={id} to url');
} else {

  checkToken();
  autoCheckForLogin();

  getData(settings.restUrl + '/RoomReservation/Rooms/')
    .then((data) => {

      const header = document.getElementById('header');
      header.style.backgroundColor = '#' + headerColor;

      if (buildingId > 0) {
        rooms = data.filter(b => b.BuildingId == buildingId)
        header.innerHTML = rooms[0].Building;
      } else {
        rooms = data.filter(b => b.Id == roomId)
        header.innerHTML = rooms[0].Designation + ' ' + rooms[0].Building;
      }

      getRoomReservation();
      scroll();

    });

  setInterval(() => {
    getRoomReservation();

  }, refresh === null ? 60000 : refresh * 60000);

}