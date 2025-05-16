const { Data } = require("../models");
const { Op } = require("sequelize");

const dataController = {
  // Bulk create records
  bulkCreate: async (req, res) => {
    try {
      const { records } = req.body;

      // Validate input
      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          message: "Records must be a non-empty array",
        });
      }

      // Validate each record
      const validationErrors = [];
      records.forEach((record, index) => {
        if (!record.name) {
          validationErrors.push(`Record ${index + 1}: Name is required`);
        }
        if (
          record.value === undefined ||
          record.value === null ||
          isNaN(record.value)
        ) {
          validationErrors.push(`Record ${index + 1}: Value must be a number`);
        }
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationErrors,
        });
      }

      // Prepare records for insertion
      const recordsToCreate = records.map((record) => ({
        name: record.name,
        description: record.description || null,
        value: parseFloat(record.value),
        status: record.status || "active",
        metadata: record.metadata || {},
      }));

      // Insert records
      const createdRecords = await Data.bulkCreate(recordsToCreate, {
        returning: true, // This will return the created records
        validate: true, // This will validate each record
      });

      res.status(201).json({
        message: "Records created successfully",
        data: createdRecords,
        count: createdRecords.length,
      });
    } catch (error) {
      console.error("Error in bulkCreate:", error);
      res.status(500).json({
        message: "Error creating records",
        error: error.message,
      });
    }
  },

  // Get all records with pagination
  findAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Data.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        items: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.error("Error in findAll:", error);
      res.status(500).json({
        message: "Error fetching records",
        error: error.message,
      });
    }
  },

  // Bulk update records
  bulkUpdate: async (req, res) => {
    try {
      const { records } = req.body;

      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          message: "Records must be a non-empty array",
        });
      }

      const results = await Promise.all(
        records.map(async (record) => {
          if (!record.id) {
            throw new Error("Record ID is required for update");
          }

          const [updatedCount] = await Data.update(
            {
              name: record.name,
              description: record.description,
              value: record.value,
              status: record.status,
              metadata: record.metadata,
            },
            {
              where: { id: record.id },
              returning: true,
            }
          );

          return {
            id: record.id,
            updated: updatedCount > 0,
          };
        })
      );

      res.json({
        message: "Records updated successfully",
        results,
      });
    } catch (error) {
      console.error("Error in bulkUpdate:", error);
      res.status(500).json({
        message: "Error updating records",
        error: error.message,
      });
    }
  },

  // Bulk delete records
  bulkDelete: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          message: "IDs must be a non-empty array",
        });
      }

      const deletedCount = await Data.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      });

      res.json({
        message: "Records deleted successfully",
        count: deletedCount,
      });
    } catch (error) {
      console.error("Error in bulkDelete:", error);
      res.status(500).json({
        message: "Error deleting records",
        error: error.message,
      });
    }
  },
};

module.exports = dataController;
