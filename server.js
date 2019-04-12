const express = require("express");

const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const PORT = process.env.PORT || 3001;

// Configure body parsing for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/googlebooks",
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);

io.on("connection", function(socket) {
  // Some client is connected.
  console.log("User connected.");
  socket.on("save", function(title) {
    // This client reported a "save" event.
    console.log("Book saved.", title);
    // Broadcast this event via "saved" to other connected clients.
    socket.broadcast.emit("saved", title);
  });
});

// Start the API server
http.listen(PORT, function(){
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
});
