import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("12345", 10);

  await prisma.users.create({
    data: {
      username: "admin",
      password: hashedPassword,
      role:"admin"
    },
  });

  console.log("User created!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
