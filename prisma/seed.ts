import { prisma } from "../src/lib/prisma";

const HOURS = [
  { day: "Mon", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Tue", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Wed", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Thu", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Fri", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Sat", open: "9:00 AM", close: "7:00 PM", closed: false },
  { day: "Sun", open: "9:00 AM", close: "7:00 PM", closed: true },
];

const SERVICES = [
  { id: "svc-haircut", name: "Haircut", price: 150, durationMinutes: 30, sortOrder: 0 },
  { id: "svc-shave", name: "Shave", price: 100, durationMinutes: 20, sortOrder: 1 },
  { id: "svc-haircut-shave", name: "Haircut + Shave", price: 230, durationMinutes: 45, sortOrder: 2 },
  { id: "svc-hot-towel-shave", name: "Hot Towel Shave", price: 150, durationMinutes: 30, sortOrder: 3 },
];

const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", sortOrder: 0 },
  { id: "gotyme", label: "GoTyme", sortOrder: 1 },
  { id: "maya", label: "Maya", sortOrder: 2 },
  { id: "bdo", label: "BDO Online Banking", sortOrder: 3 },
  { id: "bpi", label: "BPI", sortOrder: 4 },
];

async function seedClients() {
  const existing = await prisma.client.count();
  if (existing > 0) {
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
}

async function main() {
  await seedClients();

  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      shopName: "Banot's Barbershop",
      address: "Unit 4, Banot's Building, Quezon City",
      phone: "",
      hours: HOURS,
    },
  });
  for (const s of SERVICES) {
    await prisma.service.upsert({ where: { id: s.id }, update: {}, create: s });
  }
  for (const m of PAYMENT_METHODS) {
    await prisma.paymentMethod.upsert({ where: { id: m.id }, update: {}, create: m });
  }
  console.log("seeded");
}

main().finally(() => prisma.$disconnect());
