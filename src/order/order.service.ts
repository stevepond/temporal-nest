import { Injectable } from '@nestjs/common';
import { Connection, WorkflowClient } from '@temporalio/client';
import { orderWorkflow } from './workflows/order.workflow';

@Injectable()
export class OrderService {
  private client?: WorkflowClient;

  private async getClient(): Promise<WorkflowClient> {
    if (!this.client) {
      const connection = await Connection.connect();
      this.client = new WorkflowClient({ connection });
    }
    return this.client;
  }

  async processOrder(orderId: string): Promise<string> {
    const client = await this.getClient();
    const handle = await client.start(orderWorkflow, {
      taskQueue: 'order',
      args: [orderId],
      workflowId: `order-${orderId}`,
    });
    return handle.result();
  }
}
