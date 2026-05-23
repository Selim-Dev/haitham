import { SignJWT, jwtVerify } from "jose";
import { AUTH } from "./constants";

const ENCODER = new TextEncoder();

export type SessionPayload = {
  sub: string;
  role: "STUDENT" | "ADMIN";
  email: string;
  name: string;
  /** Session version — compared against UserModel.sessionVersion to invalidate
   *  older cookies when the user logs in on a different device (students only;
   *  admins are exempt — see getCurrentUser). */
  sv: number;
};

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set and at least 16 chars");
  }
  return ENCODER.encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${AUTH.TOKEN_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.sub === "string" &&
      (payload.role === "STUDENT" || payload.role === "ADMIN") &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      typeof payload.sv === "number"
    ) {
      return {
        sub: payload.sub,
        role: payload.role,
        email: payload.email,
        name: payload.name,
        sv: payload.sv,
      };
    }
    return null;
  } catch {
    return null;
  }
}
