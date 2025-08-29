// api.cache(false)
resetCache: true
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    // 'transform-remove-console', // Uncomment for production to remove console logs
  ],
};
