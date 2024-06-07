class Person {
  static validate(person) {
    if (!person.name) {
      throw new Error("Name is required");
    }
    if (!person.cpf) {
      throw new Error("CPF is required");
    }
  }

  static format(person) {
    const [firstName, ...lastName] = person.name.split(" ");
    return {
      cpf: person.cpf.replace(/\D/g, ""),
      firstName,
      lastName: lastName.join(" "),
    };
  }

  static save(person) {
    if (!["cpf", "firstName", "lastName"].every((prop) => person[prop])) {
      throw new Error(
        `Cannot save invalid persons into the database: ${JSON.stringify(
          person
        )}`
      );
    }

    console.log("Registered successfully:", person);
  }

  static process(person) {
    this.validate(person);
    const formattedPerson = this.format(person);
    this.save(formattedPerson);
    return "ok";
  }
}

Person.process({ name: "John Doe", cpf: "123.456.789-09" });

export default Person;
