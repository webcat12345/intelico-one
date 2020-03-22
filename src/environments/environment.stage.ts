// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  localStorage: {
    prefix: 'INTELICO', // prefix
    token: 'AUTH_TOKEN', // token storage
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
    baseApi: 'https://one-managment-api-stage.azurewebsites.net/api',
    readApi: 'https://one-r-stage-app.azurewebsites.net/api',
    eventApi: 'https://one-events-w-stage.azurewebsites.net/api',
    dialogFlow: 'https://one-df-stage.azurewebsites.net/api',
    socket: 'https://one-rt-stage.azurewebsites.net/api',
    readApiDetailCode: 'ni2k8RdBNmH5a2i8JFs8tYH5Aluxa7W8Q31Flsp0t5FG1u/kVWFgdw==',
    readApiListCode: 'ni2k8RdBNmH5a2i8JFs8tYH5Aluxa7W8Q31Flsp0t5FG1u/kVWFgdw==',
    readApiLookupCode: 'ni2k8RdBNmH5a2i8JFs8tYH5Aluxa7W8Q31Flsp0t5FG1u/kVWFgdw==',
    readApiReportCode: 'ni2k8RdBNmH5a2i8JFs8tYH5Aluxa7W8Q31Flsp0t5FG1u/kVWFgdw==',
    evenApiCreateCode: 'ny8YZvlf3lnMqiq4OTnbmNERT3f24B13ytPo32SJPaTbNDhkNi7V1w==',
    evenApiUpdateCode: 'ny8YZvlf3lnMqiq4OTnbmNERT3f24B13ytPo32SJPaTbNDhkNi7V1w==',
    dialogFlowSessionCode: 'iygfDSOaUqqulqXk0X5vK12fkpx1nIY3ygjmi/iGUd2jha2TWALPRQ==',
    dialogFlowMessageCode: 'iygfDSOaUqqulqXk0X5vK12fkpx1nIY3ygjmi/iGUd2jha2TWALPRQ=='
  },
  idealPostalCode: {
    baseUrl: 'https://api.ideal-postcodes.co.uk/v1/postcodes/',
    apiKey: 'ak_jlyyc36sqmPadcACuzQRoSLP6EW5K'
  }
};
