import { prisma } from "../../lib/db"; 
import { Seed_Product } from "./product";
import { Seed_Discount } from "./discount";
import { Seed_LimitRule } from "./limit";

const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  const seconds = ms / 1000;
  return seconds < 60
    ? `${seconds.toFixed(2)}s`
    : `${(seconds / 60).toFixed(2)}min`;
};

const seedData = async () => {
  const seedList = [Seed_Product, Seed_Discount, Seed_LimitRule];

  try {
    console.log("🚀 Starting database seeding process...");
    console.log(`📊 Total seeds to process: ${seedList.length}`);
    console.log(``);

    const startTotal = performance.now();

    for (let i = 0; i < seedList.length; i++) {
      const seed = seedList[i];
      if (!seed) continue;

      const seedName = seed.name.replace("Seed_", "");
      console.log(`[${i + 1}/${seedList.length}] 🌱 Starting: ${seedName}`);

      const startTime = performance.now();

      try {
        await seed();
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(
          `[${i + 1}/${seedList.length}] ✅ Completed: ${seedName} (${formatTime(duration)})`,
        );
      } catch (error) {
        console.error(
          `[${i + 1}/${seedList.length}] ❌ Failed: ${seedName}`,
          error,
        );
        throw error;
      }

      console.log(``);
    }

    const endTotal = performance.now();
    const totalDuration = endTotal - startTotal;
    console.log(
      `Total seeding process completed in ${formatTime(totalDuration)}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
