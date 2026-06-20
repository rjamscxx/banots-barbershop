import { prisma } from "../src/lib/prisma";

async function main() {
  const existing = await prisma.client.count();
  if (existing > 0) {
    console.log("Seed skipped — data already exists.");
    return;
  }

  const mark = await prisma.client.create({
    data: { name: "Mark Santos", phone: "0917 123 4567", lastVisitDate: "2026-05-29" },
  });
  const paolo = await prisma.client.create({
    data: { name: "Paolo Reyes", phone: "0928 555 1212", lastVisitDate: "2026-06-05" },
  });
  const carlo = await prisma.client.create({
    data: { name: "Carlo Tan", phone: "0939 222 8888", lastVisitDate: "2026-06-12" },
  });
  const andrei = await prisma.client.create({
    data: { name: "Andrei Cruz", phone: "0915 777 3344", lastVisitDate: null },
  });

  await prisma.booking.create({
    data: {
      clientId: mark.id,
      serviceName: "Haircut",
      servicePrice: 150,
      serviceMinutes: 30,
      date: "2026-06-19",
      time: "10:00 AM",
      status: "confirmed",
      source: "online",
      proofImageUrl: "proof-b1.jpg",
      paymentMethod: "gcash",
      reference: "BNT-100001",
    },
  });
  await prisma.booking.create({
    data: {
      clientId: paolo.id,
      serviceName: "Haircut + Shave",
      servicePrice: 230,
      serviceMinutes: 45,
      date: "2026-06-19",
      time: "11:00 AM",
      status: "confirmed",
      source: "walk_in",
    },
  });
  await prisma.booking.create({
    data: {
      clientId: carlo.id,
      serviceName: "Shave",
      servicePrice: 100,
      serviceMinutes: 20,
      date: "2026-06-19",
      time: "2:30 PM",
      status: "pending_verification",
      source: "online",
      proofImageUrl: "proof-b3.jpg",
      paymentMethod: "maya",
      reference: "BNT-100003",
    },
  });
  await prisma.booking.create({
    data: {
      clientId: andrei.id,
      serviceName: "Hot Towel Shave",
      servicePrice: 150,
      serviceMinutes: 30,
      date: "2026-06-19",
      time: "4:00 PM",
      status: "pending_verification",
      source: "online",
      proofImageUrl: "proof-b4.jpg",
      paymentMethod: "bdo",
      reference: "BNT-100004",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
