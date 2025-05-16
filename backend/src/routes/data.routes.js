const express = require("express");
const { body, query } = require("express-validator");
const dataController = require("../controllers/data.controller");

const router = express.Router();

// Validation middleware
const validateBulkCreate = [
  body().isArray(),
  body("*.name").notEmpty().trim(),
  body("*.value").isFloat(),
  body("*.status").optional().isIn(["active", "inactive"]),
  body("*.metadata").optional().isObject(),
];

const validateBulkUpdate = [
  body().isArray(),
  body("*.id").isUUID(),
  body("*.name").optional().notEmpty().trim(),
  body("*.value").optional().isFloat(),
  body("*.status").optional().isIn(["active", "inactive"]),
  body("*.metadata").optional().isObject(),
];

const validateBulkDelete = [body("ids").isArray(), body("ids.*").isUUID()];

const validateQuery = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["active", "inactive"]),
  query("search").optional().isString().trim(),
];

// Routes
router.post("/bulk", validateBulkCreate, dataController.bulkCreate);
router.get("/", validateQuery, dataController.findAll);
router.put("/bulk", validateBulkUpdate, dataController.bulkUpdate);
router.delete("/bulk", validateBulkDelete, dataController.bulkDelete);

module.exports = router;
