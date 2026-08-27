import { describe, expect, it } from "vitest";
import { LoginSchema, RegisterSchema } from "./schemas";

describe("RegisterSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = RegisterSchema.safeParse({
      name: "Geralt",
      email: "geralt@kaermorhen.example",
      password: "Wolf-School1!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = RegisterSchema.safeParse({
      name: "G",
      email: "geralt@kaermorhen.example",
      password: "Wolf-School1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = RegisterSchema.safeParse({
      name: "Geralt",
      email: "not-an-email",
      password: "Wolf-School1!",
    });
    expect(result.success).toBe(false);
  });

  it.each([
    ["shorter than 8 characters", "Ab1!"],
    ["missing a number", "NoNumbers!"],
    ["missing a letter", "12345678!"],
    ["missing a special character", "NoSpecial1"],
  ])("rejects a password that is %s", (_label, password) => {
    const result = RegisterSchema.safeParse({
      name: "Geralt",
      email: "geralt@kaermorhen.example",
      password,
    });
    expect(result.success).toBe(false);
  });

  it("accepts and trims email with leading/trailing whitespace", () => {
    const result = RegisterSchema.safeParse({
      name: "Geralt",
      email: "  geralt@kaermorhen.example  ",
      password: "Wolf-School1!",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("geralt@kaermorhen.example");
    }
  });

  it("lowercases the email", () => {
    const result = RegisterSchema.safeParse({
      name: "Geralt",
      email: "Geralt@Example.com",
      password: "Wolf-School1!",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("geralt@example.com");
    }
  });
});

describe("LoginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = LoginSchema.safeParse({
      email: "geralt@kaermorhen.example",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing password", () => {
    const result = LoginSchema.safeParse({
      email: "geralt@kaermorhen.example",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "anything",
    });
    expect(result.success).toBe(false);
  });

  it("accepts and trims email with leading/trailing whitespace", () => {
    const result = LoginSchema.safeParse({
      email: "  geralt@kaermorhen.example  ",
      password: "anything",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("geralt@kaermorhen.example");
    }
  });

  it("lowercases the email", () => {
    const result = LoginSchema.safeParse({
      email: "Geralt@Example.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("geralt@example.com");
    }
  });
});
