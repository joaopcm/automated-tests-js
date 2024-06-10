import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import Service from "../src/service.js";

describe("Service test suite", () => {
  let _service;

  beforeEach(() => {
    _service = new Service({
      filename: "testfile.ndjson",
    });
  });

  describe("#read", () => {
    it("should return an empty array when file is empty", async () => {
      jest.spyOn(fsSync, fsSync.existsSync.name).mockReturnValue(true);
      jest.spyOn(fs, fs.readFile.name).mockResolvedValue("");

      const result = await _service.read();
      expect(result).toEqual([]);
    });

    it('should return an empty array when file does not exist', async () => {
      jest.spyOn(fsSync, "existsSync").mockReturnValue(false);

      const result = await _service.read();
      expect(result).toEqual([]);
    })

    it("should return an array of users without password when file is not empty", async () => {
      const dbData = [
        {
          username: "user1",
          password: "password1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "password2",
          createdAt: new Date().toISOString(),
        },
      ];
      const fileContents = dbData
        .map((item) => JSON.stringify(item).concat("\n"))
        .join("");
      jest.spyOn(fs, "readFile").mockResolvedValue(fileContents);
      jest.spyOn(fsSync, "existsSync").mockReturnValue(true);

      const result = await _service.read();
      const expected = dbData.map(({ password, ...user }) => user);
      expect(result).toStrictEqual(expected);
    });
  });
});
