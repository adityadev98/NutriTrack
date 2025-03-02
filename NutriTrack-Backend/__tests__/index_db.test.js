import * as config from "../config/index.js";
import { connectDB } from "../config/db.js";

describe("Config Module", () => {
  it("should export connectDB function", () => {
    expect(config.connectDB).toBe(connectDB);
  });
});
