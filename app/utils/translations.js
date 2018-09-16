const translator = require('react-native-i18n-complete-corrected');

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en` 
translator.fallbacks = true;

translator.translations = {
 'en': {
   
 //Home Screen
   homeScreenTitle: 'HOME',

 },
 'en-FR': {
   loginHeaderTitle: 'S\'identifier'
 }
}

export default translator
