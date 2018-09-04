import { Platform } from 'react-native';
 
const hashApp = Platform.OS === 'ios' ? 'aMxnZ9Rfdn22hzUyh2ZKTyV7Noo3vnMb' : 'QfZTqFxTd3FSg1NAejCvACvgfLnzoN2R'
 
const Constants = {
  //Quanto prima
  HASH_APP: hashApp,
  CURRENT_VERSION_APP: '2.0',
 
  // São Braz
  // HASH_APP: '7vwITD7QRMABPwR7j7SavpV4rbh97fdc',
  // CURRENT_VERSION_APP: '2.0',
 
  // TEST_USER_ID: 1359,
 
  // SERVER_URL: 'http://mobiclub.com.br/api/Service/',
  SERVER_URL: 'https://www.mobiclub.com.br/api/Service/',
 
  instagram: 'https://www.instagram.com/quantoprima/',
  facebook: 'https://www.facebook.com/quantoprima/',
 
  onesignalTagApp: 'quantoprima',
  appUserTag: 'q',
  cpfObrigation: true,

  analyticsTrackerId: 'UA-114931163-1',
  analyticsAppName: 'quantoprima',

  franchiseName: 'Quanto Prima',
 
  TERMS_URL: 'https://www.mobiclub.com.br/termopolitica/quantoprima',
  ABOUT_URL: 'https://www.mobiclub.com.br/sobreoapp/quantoprima',
  FAQ_URL: 'https://quantoprima.zendesk.com/hc/pt-br',
  APP_URL: 'http://mobiclub.com.br',

  SUPPORT_EMAIL: 'support@quantoprima.zendesk.com',
};
 
export default Constants;
