// module.exports = {
//   presets: ["babel-preset-expo", "nativewind/babel"],
// };

// module.exports = {
//   presets: ["babel-preset-expo"],
//   plugins: ["nativewind/babel"],
// };

// module.exports = {
//   presets: [
//     ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//     "nativewind/babel",
//   ],
// };

// module.exports = {
//   presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
// };

module.exports = {
  presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
  plugins: ["react-native-reanimated/plugin"],
};
