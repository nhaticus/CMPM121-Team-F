const express = require("express");
const path = require("path");

const app = express();

// Serve static files from root, "src", and "lib" directories
app.use(express.static(__dirname));
app.use("/src", express.static(path.join(__dirname, "src")));
app.use("/lib", express.static(path.join(__dirname, "lib")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
