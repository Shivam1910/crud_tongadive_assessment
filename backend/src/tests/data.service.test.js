const dataService = require("../services/data.service");
const Data = require("../models/data.model");

// Mock the Data model
jest.mock("../models/data.model");

describe("DataService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("bulkCreate", () => {
    it("should create multiple records successfully", async () => {
      const mockRecords = [
        { name: "Test 1", value: 100 },
        { name: "Test 2", value: 200 },
      ];

      const mockCreatedRecords = mockRecords.map((record) => ({
        id: "uuid-1",
        ...record,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      Data.bulkCreate.mockResolvedValue(mockCreatedRecords);

      const result = await dataService.bulkCreate(mockRecords);

      expect(Data.bulkCreate).toHaveBeenCalledWith(mockRecords, {
        validate: true,
        returning: true,
      });
      expect(result).toEqual(mockCreatedRecords);
    });

    it("should handle errors during bulk create", async () => {
      const mockRecords = [{ name: "Test 1", value: 100 }];
      const mockError = new Error("Database error");

      Data.bulkCreate.mockRejectedValue(mockError);

      await expect(dataService.bulkCreate(mockRecords)).rejects.toThrow(
        "Error in bulk create: Database error"
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated results", async () => {
      const mockOptions = { page: 1, limit: 10 };
      const mockResult = {
        count: 2,
        rows: [
          { id: "uuid-1", name: "Test 1", value: 100 },
          { id: "uuid-2", name: "Test 2", value: 200 },
        ],
      };

      Data.findAndCountAll.mockResolvedValue(mockResult);

      const result = await dataService.findAll(mockOptions);

      expect(Data.findAndCountAll).toHaveBeenCalled();
      expect(result.data).toEqual(mockResult.rows);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe("bulkUpdate", () => {
    it("should update multiple records successfully", async () => {
      const mockRecords = [
        { id: "uuid-1", name: "Updated 1" },
        { id: "uuid-2", name: "Updated 2" },
      ];

      Data.update.mockResolvedValue([1]);

      const result = await dataService.bulkUpdate(mockRecords);

      expect(Data.update).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });
  });

  describe("bulkDelete", () => {
    it("should delete multiple records successfully", async () => {
      const mockIds = ["uuid-1", "uuid-2"];
      const mockDeletedCount = 2;

      Data.destroy.mockResolvedValue(mockDeletedCount);

      const result = await dataService.bulkDelete(mockIds);

      expect(Data.destroy).toHaveBeenCalledWith({
        where: { id: mockIds },
      });
      expect(result).toBe(mockDeletedCount);
    });
  });
});
