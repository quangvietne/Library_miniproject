const { ActivityLog } = require("../models");

module.exports = async (req, res, next) => {
  res.on("finish", async () => {
    if (req.user) {
      await ActivityLog.create({
        user_id: req.user.id,
        action: `${req.method} ${req.originalUrl}`,
        details: JSON.stringify(req.body),
      });
    }
  });
  next();
};
