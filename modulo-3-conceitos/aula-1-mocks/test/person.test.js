import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person";

describe("#Person", () => {
  describe("#validate", () => {
    it("should throw an error if name is not provided", () => {
      const mockInvalidPerson = {
        cpf: "123.456.789-09",
      };
      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("Name is required")
      );
    });

    it("should throw an error if CPF is not provided", () => {
      const mockInvalidPerson = {
        name: "John Doe",
      };
      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("CPF is required")
      );
    });

    it("should not throw an error if person is valid", () => {
      const mockInvalidPerson = {
        name: "John Doe",
        cpf: "123.456.789-09",
      };
      expect(() => Person.validate(mockInvalidPerson)).not.toThrow();
    });
  });

  describe("#format", () => {
    it("should format the person name and CPF", () => {
      const mockPerson = {
        name: "John Doe",
        cpf: "123.456.789-09",
      };
      const formattedPerson = Person.format(mockPerson);
      const expected = {
        firstName: "John",
        lastName: "Doe",
        cpf: "12345678909",
      };

      expect(formattedPerson).toStrictEqual(expected);
    });
  });

  describe("#save", () => {
    it("should throw an error if the person is invalid", () => {
      const mockInvalidPerson = {};

      expect(() => Person.save(mockInvalidPerson)).toThrow(
        new Error(
          `Cannot save invalid persons into the database: ${JSON.stringify(
            mockInvalidPerson
          )}`
        )
      );
    });

    it("should not throw an error if the person is valid", () => {
      const mockValidPerson = {
        firstName: "John",
        lastName: " Doe",
        cpf: "1234567809",
      };
      expect(() => Person.save(mockValidPerson)).not.toThrow();
    });
  });

  describe("#process", () => {
    it("should process a valid person", () => {
      const mockPerson = {
        cpf: "123.456.789-09",
        name: "John Doe",
      };

      jest.spyOn(Person, Person.validate.name).mockReturnValue();
      jest.spyOn(Person, Person.format.name).mockReturnValue({
        firstName: "John",
        lastName: "Doe",
        cpf: "1234567809",
      });
      jest.spyOn(Person, Person.save.name).mockReturnValue();

      const result = Person.process(mockPerson);
      expect(result).toBe("ok");
    });
  });
});
