const Data = require("../models/data.model");

class DataService {
  async bulkCreate(records) {
    try {
      const createdRecords = await Data.bulkCreate(records, {
        validate: true,
        returning: true,
      });
      return createdRecords;
    } catch (error) {
      throw new Error(`Error in bulk create: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, status, search } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Data.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error in findAll: ${error.message}`);
    }
  }

  async bulkUpdate(records) {
    try {
      const updates = await Promise.all(
        records.map(async (record) => {
          const [updatedRecord] = await Data.update(record, {
            where: { id: record.id },
            returning: true,
          });
          return updatedRecord;
        })
      );
      return updates;
    } catch (error) {
      throw new Error(`Error in bulk update: ${error.message}`);
    }
  }

  async bulkDelete(ids) {
    try {
      const deletedCount = await Data.destroy({
        where: {
          id: ids,
        },
      });
      return deletedCount;
    } catch (error) {
      throw new Error(`Error in bulk delete: ${error.message}`);
    }
  }
}

module.exports = new DataService();
