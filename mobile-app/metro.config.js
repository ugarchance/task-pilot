const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add all asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'ttf',
  'otf'
];

// Add all source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs'
];

module.exports = config;