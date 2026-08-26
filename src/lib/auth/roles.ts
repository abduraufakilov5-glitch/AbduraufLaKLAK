export const APP_ROLES = ["ADMIN", "CONTENT_MANAGER", "WAREHOUSE_MANAGER"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_PERMISSIONS = {
  ADMIN: ["products:read","products:write","inventory:read","inventory:write","orders:read","orders:write","analytics:read","finance:read","ai:write","users:write"],
  CONTENT_MANAGER: ["products:read","products:write","inventory:read","orders:read","ai:write"],
  WAREHOUSE_MANAGER: ["products:read","inventory:read","inventory:write","orders:read","orders:write"],
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[AppRole][number];
export function hasPermission(role: AppRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}
export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (APP_ROLES as readonly string[]).includes(value);
}