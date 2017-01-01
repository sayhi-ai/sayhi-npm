var sayHi = require("../dev/lib.min");
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODU4NzMyOTAsImlhdCI6MTQ4MzI4MTI5MCwicHJvamVjdElkIjoiY2l0Y3lveDN6MHBiaDAxNzF1Nmk2YjhudSIsInVzZXJJZCI6ImNpeDlocDloZjc3YWcwMTI4aGV4cm5mNXoiLCJhdXRoRGF0YSI6eyJlbWFpbCI6Imp1bGlhbmJyZW5kbEBnbWFpbC5jb20ifX0.WcGRDDAKESYSwJStieVQ4DjcTsdV10Yge4OdrskQsos'

sayHi.init(token)
  .then(result => {
    const bot = sayHi.getBot("translation-bot");
    return bot.say("error");
  })
  .then(response => console.log(response))
  .catch(error => {
    console.log(error);
  });
