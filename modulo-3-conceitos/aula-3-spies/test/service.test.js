import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import Service from "../src/service.js";

describe("Service test suite", () => {
  let _service;

  describe("#create", () => {
    const MOCKED_PASSWORD_HASH = "hashed-password";
    const FILENAME = "test-file.ndjson";

    beforeEach(() => {
      jest.spyOn(crypto, crypto.createHash.name).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(MOCKED_PASSWORD_HASH),
      });
      jest.spyOn(fs, fs.appendFile.name).mockResolvedValue();

      _service = new Service({
        filename: FILENAME,
      });
    });

    it("should call appendFile and createHash with the right params", async () => {
      const input = {
        username: "user1",
        password: "password1",
      };

      const expectedCreatedAt = new Date().toISOString();
      jest
        .spyOn(Date.prototype, Date.prototype.toISOString.name)
        .mockReturnValue(expectedCreatedAt);

      await _service.create(input);
      expect(crypto.createHash).toHaveBeenNthCalledWith(1, "sha256");

      const hash = crypto.createHash("sha256");
      expect(hash.update).toHaveBeenNthCalledWith(1, input.password);
      expect(hash.digest).toHaveBeenNthCalledWith(1, "hex");

      const expected = JSON.stringify({
        ...input,
        createdAt: expectedCreatedAt,
        password: MOCKED_PASSWORD_HASH,
      }).concat("\n");
      expect(fs.appendFile).toHaveBeenNthCalledWith(1, FILENAME, expected);
    });
  });
});
