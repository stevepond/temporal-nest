import { proxyActivities, defineSignal, setHandler } from '@temporalio/workflow';
import * as activities from '../activities/order.activities';

const { chargeCreditCard, shipOrder } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const updateStatus = defineSignal<[string]>('updateStatus');

export async function orderWorkflow(orderId: string): Promise<string> {
  let status = 'created';
  setHandler(updateStatus, (s: string) => { status = s; });

  await chargeCreditCard(orderId);
  await shipOrder(orderId);

  return status;
}
