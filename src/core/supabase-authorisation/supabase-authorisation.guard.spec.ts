import { SupabaseAuthorisationGuard } from "./supabase-authorisation.guard";

describe("SupabaseAuthorisationGuard", () => {
  it("should be defined", () => {
    expect(new SupabaseAuthorisationGuard()).toBeDefined();
  });

  it("should return fals when authorization header is missing", async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
    const guard = new SupabaseAuthorisationGuard();
    const result = await guard.canActivate(context as any);
    expect(result).toBe(false);
  });

  it("should return fals when token is missing", async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer",
          },
        }),
      }),
    };
    const guard = new SupabaseAuthorisationGuard();
    const result = await guard.canActivate(context as any);
    expect(result).toBe(false);
  });

  it("should return true when token is present", async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer token",
          },
        }),
      }),
    };
    const guard = new SupabaseAuthorisationGuard();
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
  });
});
