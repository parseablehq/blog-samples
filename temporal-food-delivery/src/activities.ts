import { log } from '@temporalio/activity';

export async function placeOrder(orderId: string, userId: string): Promise<void> {
  log.info(`Placing order with ID: ${orderId} for user: ${userId}`);
}

export async function makePayment(orderId: string, userId: string): Promise<void> {
  const success = Math.random() > 0.2; // 20% chance to fail
  if (success) {
    log.info(`Payment successful for order ID: ${orderId}, user: ${userId}`);
  } else {
    throw new Error(`Payment failed for order ID: ${orderId}, user: ${userId}`);
  }
}

export async function prepareOrder(orderId: string, userId: string): Promise<void> {
  log.info(`Preparing order with ID: ${orderId} for user: ${userId}`);
}

export async function deliverOrder(orderId: string, userId: string): Promise<void> {
  log.info(`Delivering order with ID: ${orderId} for user: ${userId}`);
}

export async function pickupOrder(orderId: string, userId: string): Promise<void> {
  log.info(`Order with ID: ${orderId} has been picked up by user: ${userId}`);
}
