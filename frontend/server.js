const express = require("express");
const app = express();

app.use((_, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.static("build"));

app.use(express.static("hosted"));

app.get("/*", (req, res) => {
  if (req.path.substring(1, 7) === "hosted") res.sendFile(__dirname + req.path);
  else res.sendFile(__dirname + "/build/index.html");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
