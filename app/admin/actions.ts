"use server";

export async function verifyPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
  return password === correctPassword;
}
