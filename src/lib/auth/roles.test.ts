import { describe, expect, it } from "vitest";
import { hasPermission, isAppRole } from "./roles";

describe("RBAC", () => {
  it("enforces role permissions", () => {
    expect(hasPermission("ADMIN", "finance:read")).toBe(true);
    expect(hasPermission("CONTENT_MANAGER", "finance:read")).toBe(false);
    expect(hasPermission("WAREHOUSE_MANAGER", "inventory:write")).toBe(true);
    expect(hasPermission("WAREHOUSE_MANAGER", "users:write")).toBe(false);
  });
  it("recognizes only supported roles", () => {
    expect(isAppRole("ADMIN")).toBe(true);
    expect(isAppRole("SUPERUSER")).toBe(false);
    expect(isAppRole(null)).toBe(false);
  });
});