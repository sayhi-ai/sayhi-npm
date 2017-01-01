var sayHi = require("../dev/lib.min");
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODU4MTA4MjgsImlhdCI6MTQ4MzIxODgyOCwicHJvamVjdElkIjoiY2l0Y3lveDN6MHBiaDAxNzF1Nmk2YjhudSIsInVzZXJJZCI6ImNpeDlocDloZjc3YWcwMTI4aGV4cm5mNXoiLCJhdXRoRGF0YSI6eyJlbWFpbCI6Imp1bGlhbmJyZW5kbEBnbWFpbC5jb20ifX0.dnbL-A7tObce_nF9va0kq-tKjNSwa3yHfAqEOtBFPKI";

sayHi.init(token)
  .then(result => {
    const bot = sayHi.getBot("bot1");
    return bot.say("jhhj", {
      name: "Julian"
    });
  })
  .then(response => console.log(response))
  .catch(error => {
    console.log(error);
  });

// let response = "Hey {name}! {}";
// const vars = {
//   name: "Julian"
// };
// const keys = Object.keys(vars);
// keys.forEach(key => {
//   const regex = new RegExp('{' + key + '}', "g");
//
//   response = response.replace(regex, vars[key]);
// });
// console.log(response);
