const express = require("express");
const Registry = require("../lib/Registry");

const registry = new Registry();

const router = express.Router();

function getRequestArguments(req) {
  const { servicename, serviceversion, serviceport } = req.params;
  let serviceip = req.ip;
  if (serviceip.includes("::1") || serviceip.includes("::ffff:127.0.0.1")) {
    serviceip = "127.0.0.1";
  }
  return { servicename, serviceversion, serviceip, serviceport };
}

router.put(
  "/register/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    const { servicename, serviceversion, serviceip, serviceport } =
      getRequestArguments(req);
    const key = registry.register(
      servicename,
      serviceversion,
      serviceip,
      serviceport
    );
    return res.json({ result: key });
  }
);

router.delete(
  "/register/:servicename/:serviceversion/:serviceport",
  (req, res, next) => {
    const { servicename, serviceversion, serviceip, serviceport } =
      getRequestArguments(req);
    const key = registry.unregister(
      servicename,
      serviceversion,
      serviceip,
      serviceport
    );
    return res.json({ result: key });
  }
);

router.get("/find/:servicename/:serviceversion/", (req, res, next) => {
  const { servicename, serviceversion } = getRequestArguments(req);
  const service = registry.get(servicename, serviceversion);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  return res.json(service);
});

module.exports = router;
