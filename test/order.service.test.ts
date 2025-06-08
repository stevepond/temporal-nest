import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { OrderService } from '../src/order/order.service';
import * as activities from '../src/order/activities/order.activities';

let env: TestWorkflowEnvironment;

test('processOrder runs the workflow', async () => {
  env = await TestWorkflowEnvironment.create();
  const worker = await Worker.create({
    connection: env.nativeConnection,
    workflowsPath: require.resolve('../src/order/workflows/order.workflow'),
    activities,
    taskQueue: env.taskQueue,
  });

  const orderService = new OrderService();
  // Override client with env.workflowClient
  (orderService as any).getClient = async () => env.workflowClient;

  const workerRunPromise = worker.run();

  const result = await orderService.processOrder('1');
  assert.equal(result, 'created');

  await env.client.close();
  worker.shutdown();
  await workerRunPromise;
});
