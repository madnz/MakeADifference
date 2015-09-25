var Hoist = require('@hoist/node-sdk');

//Use your API key from the Dashboard of your application
Hoist.setApiKey("");

Hoist.raise("signup", {
    "email":"adrian@iceknife.com"
});