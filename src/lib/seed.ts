import bcrypt from "bcrypt";

import { db } from "../drizzle/index";
import { user } from "../drizzle/schema";

async function seedUser() {
  try {
    console.log("🌱 Starting user seeding...");

    const saltRounds = 10;
    const plainPassword = "password123";
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const testUser = {
      email: "test@example.com",
      password: hashedPassword,
    };

    const [createdUser] = await db.insert(user).values(testUser).returning({
      id: user.id,
      email: user.email,
    });

    console.log("User seeded successfully:");
    console.log("Email:", createdUser.email);
    console.log("Password:", plainPassword);
    console.log("ID:", createdUser.id);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
}

seedUser();
