const router = require("express").Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "server health is good",
  });
});

module.exports = router;
