import { SignJWT, jwtVerify } from "jose";
import { AUTH } from "./constants";

const ENCODER = new TextEncoder();

export type SessionPayload = {
  sub: string;
  role: "STUDENT" | "ADMIN";
  email: string;
  name: string;
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
      typeof payload.name === "string"
    ) {
      return {
        sub: payload.sub,
        role: payload.role,
        email: payload.email,
        name: payload.name,
      };
    }
    return null;
  } catch {
    return null;
  }
}
