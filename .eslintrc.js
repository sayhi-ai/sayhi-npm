module.exports = {
  "extends": "google",
  rules: {
    "max-len": [2, 125, 4, {ignoreComments: true, ignoreUrls: true}],
    "new-cap": ["error", { "capIsNew": false }],
    "semi": ["error", "never"]
  }
};