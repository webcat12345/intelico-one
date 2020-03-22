export const environment = {
  production: true,
  localStorage: {
    prefix: 'INTELICO', // prefix
    token: 'AUTH_TOKEN', // token storage,
    users_teams: 'USERS_TEAMS', // user personal data tied to a specific team and events
    expiresAtToken: 'EXPIRES_AT_TOKEN', // time token expires
    refresh_token: 'REFRESH_AUTH_TOKEN', // refresh token storage
    last_update: 'LAST_UPDATE', // last app update date check
    user_info: 'ME', // authenticated user info
    organisation: 'ORG' // org storage
  },
  personalSettings: 'PERSONAL_SETTINGS',
  systemCache: {
    opendWindows: 'OPEND_WINDOWS',
    boxesArray: 'BOXES'
  },
  idle: {
    idleTimer: 2400,
    idleCountDownTimer: 300
  },
  cookie: {
    storage: 'INTELICO_SECURE', // cookie storage
    value: 'DK383932NVM', // cookie key
    life: 5 // life cycle of cookie days
  },
  agmAPIKey: 'AIzaSyBuUbcy1Eg-zJbqB88UGea-hSkY46saAAs',
  hotKeys: [
    {name: 'fullscreen', key: 'f'},
    {name: 'minimize', key: 'h'},
    {name: 'normal', key: 'n'},
    {name: 'menu', key: 'm'},
    {name: 'close', key: 'q'},
    {name: 'alert', key: 'a'},
    {name: 'cancel', key: 'esc'}
  ],
  sounds: {
    root: '../../assets/sounds/',
    login: 'pad_confirm.wav',
    click: 'click_natural.wav',
    minimize: 'slide_drop.wav',
    maximize: 'slide_up.wav',
    alertOpen: 'digi_turn_on.wav',
    alertClose: 'digi_turn_off.wav'
  },
  jwtToken: {
    userRoleClaims: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  },
  apis: {
    baseApi: 'https://one-api-v3-test.azurewebsites.net/api/',
    readApi: 'https://one-read-dev.azurewebsites.net/api',
    eventApi: 'https://eventsv1.azurewebsites.net/api',
    dialogFlow: 'https://dialogflow123.azurewebsites.net/api',
    socket: 'https://event-rt-dev1.azurewebsites.net/api',
    readApiDetailCode: 'bpSdhyY/4AKQmqfD1aXGnpv793mqU1QIs8pUhuVTjE6p3WmGhrgBmg==',
    readApiListCode: 'cRezsaufJALChgQFeCiY1vd6IHMDcZkGDqliUQ9WwCuYYyULXNIMnQ==',
    readApiLookupCode: 'fOVZ6K5EA0lWYQTvbbphud63POKwC2gx1k37y6DIb6rdJDTJg0gBtw==',
    readApiReportCode: 'NXp7FOkYDK3NVDbo9ayLz55Fqn0P8F9oDmc5jnAcoYXnCrKzquCIQA==',
    evenApiCreateCode: '66RJhmaEtYHp/1lZaD2cxa8dEFCaqH1oDpAQrBtrPuBLyYKTHZorXw==',
    evenApiUpdateCode: 'ybFMKrdxQ1GxPXrDSYKwlQA7soGvTofjdbZmoEPtrIE6guv4sQiZig==',
    dialogFlowSessionCode: 'gdach2Nz7VtmzLaK3kDrjPOpsUf7gVcYIeNNHp5CiRQuSyCgBweU3g==',
    dialogFlowMessageCode: 'iepzam8NWn9EzQtoujJBYAVIy0UcrQKW8lFBW7q6oITSTV7QbyhVmA=='
  },
  idealPostalCode: {
    baseUrl: 'https://api.ideal-postcodes.co.uk/v1/postcodes/',
    apiKey: 'ak_jlyyc36sqmPadcACuzQRoSLP6EW5K'
  }
};
