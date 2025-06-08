export async function chargeCreditCard(orderId: string): Promise<void> {
  // In a real app, call payment provider
  console.log(`Charging credit card for order ${orderId}`);
}

export async function shipOrder(orderId: string): Promise<void> {
  // In a real app, call shipping provider
  console.log(`Shipping order ${orderId}`);
}
