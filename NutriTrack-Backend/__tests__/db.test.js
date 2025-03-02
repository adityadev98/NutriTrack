import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

jest.mock("mongoose"); // Mock mongoose methods

describe("Database Connection", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should connect to MongoDB successfully", async () => {
    mongoose.connect.mockResolvedValue({
      connection: { host: "mocked_host" },
    });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(consoleSpy).toHaveBeenCalledWith("MongoDB Connected: mocked_host");

    consoleSpy.mockRestore();
  });

  it("should log an error and exit process on failure", async () => {
    const errorMessage = "Connection failed";
    mongoose.connect.mockRejectedValue(new Error(errorMessage));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {}); // Mock process.exit to prevent test exit

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: ${errorMessage}`);
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
