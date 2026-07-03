export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function generateBookingReference() {
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `BNT-${random}`;
}
