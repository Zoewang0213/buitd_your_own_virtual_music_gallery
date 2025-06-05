const express = require("express");
const corsAnywhere = require("cors-anywhere");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, script.js, etc.)
app.use(express.static("public"));

// Integrate CORS Anywhere as middleware
const corsOptions = {
    originWhitelist: [], // Allow all origins
};
app.use("/proxy", (req, res, next) => {
    console.log("Proxying request:", req.url);
    req.url = req.url.replace("/proxy/", "/"); // Adjust the request path for the proxy
    corsAnywhere.createServer(corsOptions).emit("request", req, res);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
