import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export const hashValue = (value: string) => bcrypt.hash(value, 12);
export const compareHash = (value: string, hash: string) => bcrypt.compare(value, hash);

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
  } as SignOptions);
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN
  } as SignOptions);
}

export function signResetToken(userId: string) {
  return jwt.sign({ sub: userId, type: "reset" }, env.JWT_RESET_SECRET, {
    expiresIn: "30m"
  });
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
