const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function androidManifestPlugin(config) {
  return withAndroidManifest(config, async config => {
    let androidManifest = config.modResults.manifest;

    // tools:namespace ekleyin
    androidManifest.$ = {
      ...androidManifest.$,
      'xmlns:tools': 'http://schemas.android.com/tools',
    };

    // INTERNET iznini ekleyin
    const internetPermission = {
      $: {
        'android:name': 'android.permission.INTERNET',
      },
    };

    if (!androidManifest['uses-permission'].some(perm => perm.$['android:name'] === 'android.permission.INTERNET')) {
      androidManifest['uses-permission'].push(internetPermission);
    }

    // RECORD_AUDIO iznini kaldırma işlemi
    androidManifest['uses-permission'] = androidManifest['uses-permission'].map(perm => {
      if (perm.$['android:name'] === 'android.permission.RECORD_AUDIO') {
        perm.$['tools:node'] = 'remove';
      }
      return perm;
    });

    // Cleartext (HTTP) trafiğine izin ver
    androidManifest['application'][0].$['android:usesCleartextTraffic'] = 'true';

    return config;
  });
};
