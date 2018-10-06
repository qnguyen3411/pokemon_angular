const express = require('express');
const app = express();
app.use(express.static( __dirname + '/../public/dist/public' ));

app.listen(8000, () => {
  console.log("LISTENING AT PORT 8000");
})