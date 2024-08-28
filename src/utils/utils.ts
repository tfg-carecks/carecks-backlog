import { red, cyan, green } from "colorette";

//local imports
import { Role } from "../models/rol";
import { User } from "../models/user";

export const roles = [
  { name: "admin" },
  { name: "anonymous" },
  { name: "authenticated" },
];

async function createRoles() {
  for (const role of roles) {
    const rol = await Role.findOne({ name: role.name });
    if (!rol) {
      await Role.create(role);
    }
  }
}

async function createModels() {
  try {
    createRoles();
    console.log(green("Creating models..."));
    await User.createCollection();
    console.log(cyan("User model created"));
  } catch (error: any) {
    console.log(red(`Can't create models: ${error.message}`));
  }
}

export async function createDatabase() {
  try {
    await createModels();
  } catch (error: any) {
    console.log(red(`Can't create the database: ${error.message}`));
  }
}

export async function getUserByEmailOrUsername(
  email: string,
  username: string
) {
  return await User.findOne({ $or: [{ email }, { username }] });
}
