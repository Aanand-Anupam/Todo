import "dotenv/config";

const env_variables = [
  "PORT",
  "DB_URI",
  "DB_NAME",
  "ACCESS_KEY",
  "REFRESH_KEY",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET",
];

env_variables.forEach((env_var) => {
  if (!process.env[env_var]) {
    throw new Error(`Env variable is not defined: ${env_var}`);
  }
});

export const Port = process.env.PORT!;
export const DB_URI = process.env.DB_URI!;
export const DB_NAME = process.env.DB_NAME!;
export const ACCESS_KEY = process.env.ACCESS_KEY!;
export const REFRESH_KEY = process.env.REFRESH_KEY!;
export const CLOUD_NAME = process.env.CLOUD_NAME!;
export const API_KEY = process.env.API_KEY!;
export const API_SECRET = process.env.API_SECRET!;
