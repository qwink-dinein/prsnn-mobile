// Extends app.json.
// - Android push: Firebase's google-services.json comes from the EAS file variable GOOGLE_SERVICES_JSON
//   (Expo dashboard → project → Environment variables, type "file"), or a local ./google-services.json for
//   local builds. It is never committed.
// - `SINGLE_BUNDLE=1` disables web route code-splitting so the web build can be packed into one
//   self-contained HTML file (used for the hosted web preview).
const fs = require('fs');

module.exports = ({ config }) => {
  const googleServicesFile = process.env.GOOGLE_SERVICES_JSON || (fs.existsSync('./google-services.json') ? './google-services.json' : undefined);
  const withPush = googleServicesFile ? { ...config, android: { ...config.android, googleServicesFile } } : config;
  if (process.env.SINGLE_BUNDLE !== '1') return withPush;
  return {
    ...withPush,
    plugins: withPush.plugins.map((p) => (p === 'expo-router' ? ['expo-router', { asyncRoutes: { web: false } }] : p)),
  };
};
