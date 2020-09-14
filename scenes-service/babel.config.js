module.exports = {
  plugins: [
    [
      "babel-plugin-module-resolver",
      {
        alias: {
          "src": "./src"
        }
      }
    ]
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: true
        }
      }
    ]
  ]
};