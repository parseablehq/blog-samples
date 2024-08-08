import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { placeOrder, makePayment, prepareOrder, deliverOrder, pickupOrder } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function orderWorkflow(): Promise<void> {
  const orderId = Math.round(Math.random() * 1000).toString();
  const userId =  Math.round(Math.random() * 1000).toString();
  try {
    await placeOrder(orderId, userId);
    await makePayment(orderId, userId);
    await prepareOrder(orderId, userId);
    await deliverOrder(orderId, userId);
    await pickupOrder(orderId, userId);
  } catch (error) {
    console.error(`Workflow failed for order ID: ${orderId}, user: ${userId}. Error: ${error}`);
  }
}
