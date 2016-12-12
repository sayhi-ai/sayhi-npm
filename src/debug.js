var sayHi = require("../dev/lib.min");

// sayHi.login("vader@sayhi.ai", "darth").then(response => {
//     if (response.status === 200) {
//         response.json().then(json => {
//             console.log("success: " + JSON.stringify(json, null, 2))
//         });
//     } else {
//         response.json().then(json => {
//             console.log("error: " + JSON.stringify(json, null, 2))
//         });
//     }
// });

var darthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODQxNTI0NTgsImlhdCI6MTQ4MTU2MDQ1OCwicHJvamVjdElkIjoiY2l0Y3lveDN6MHBiaDAxNzF1Nmk2YjhudSIsInVzZXJJZCI6ImNpd202dXdqZ3Jpd2wwMTAxd283Zmprd3UiLCJhdXRoRGF0YSI6eyJlbWFpbCI6InZhZGVyQHNheWhpLmFpIn19.yiilmYOVXTV9AjdPnYL4ptBShTbGYlldukRLvvnQro4";

// sayHi.say(darthToken, "p", "p", false).then(response => {
//     if (response.status === 200) {
//         response.json().then(json => {
//             console.log("success: " + JSON.stringify(json, null, 2))
//         });
//     } else {
//         response.json().then(json => {
//             console.log("error: " + JSON.stringify(json, null, 2))
//         });
//     }
// });

sayHi.addResponse(darthToken, "f", "g", "o$VAR").then(response => {
    if (response.status === 200) {
        response.json().then(json => {
            console.log("success: " + JSON.stringify(json, null, 2))
        });
    } else {
        response.json().then(json => {
            console.log("error: " + JSON.stringify(json, null, 2))
        });
    }
});

// sayHi.removeResponse(darthToken, "test").then(response => {
//     if (response.status === 200) {
//         response.json().then(json => {
//             console.log("success: " + JSON.stringify(json, null, 2))
//         });
//     } else {
//         response.json().then(json => {
//             console.log("error: " + JSON.stringify(json, null, 2))
//         });
//     }
// });