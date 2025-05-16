const dataController = require("../controllers/data.controller");
const dataService = require("../services/data.service");
const { validationResult } = require("express-validator");

// Mock the data service and express-validator
jest.mock("../services/data.service");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("DataController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("bulkCreate", () => {
    it("should create records successfully", async () => {
      const mockRecords = [
        { name: "Test 1", value: 100 },
        { name: "Test 2", value: 200 },
      ];
      mockReq.body = mockRecords;

      const mockCreatedRecords = mockRecords.map((record) => ({
        id: "uuid-1",
        ...record,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Mock validation result to return no errors
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      dataService.bulkCreate.mockResolvedValue(mockCreatedRecords);

      await dataController.bulkCreate(mockReq, mockRes);

      expect(dataService.bulkCreate).toHaveBeenCalledWith(mockRecords);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        data: mockCreatedRecords,
      });
    });

    it("should handle validation errors", async () => {
      mockReq.body = [{ name: "", value: "invalid" }];

      // Mock validation result to return errors
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid input" }],
      });

      await dataController.bulkCreate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid input" }],
      });
    });
  });

  describe("findAll", () => {
    it("should return paginated results", async () => {
      const mockOptions = { page: 1, limit: 10 };
      mockReq.query = mockOptions;

      const mockResult = {
        data: [
          { id: "uuid-1", name: "Test 1", value: 100 },
          { id: "uuid-2", name: "Test 2", value: 200 },
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          pages: 1,
        },
      };

      dataService.findAll.mockResolvedValue(mockResult);

      await dataController.findAll(mockReq, mockRes);

      expect(dataService.findAll).toHaveBeenCalledWith(mockOptions);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        ...mockResult,
      });
    });
  });
});
