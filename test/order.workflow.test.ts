import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { orderWorkflow } from '../src/order/workflows/order.workflow';
import * as activities from '../src/order/activities/order.activities';

let env: TestWorkflowEnvironment;

test('orderWorkflow executes', async () => {
  env = await TestWorkflowEnvironment.create();
  const worker = await Worker.create({
    connection: env.nativeConnection,
    workflowsPath: require.resolve('../src/order/workflows/order.workflow'),
    activities,
    taskQueue: env.taskQueue,
  });

  const workerRunPromise = worker.run();

  const result = await env.workflowClient.execute(orderWorkflow, {
    args: ['1'],
    taskQueue: env.taskQueue,
    workflowId: 'wf-test',
  });
  assert.equal(result, 'created');

  await env.client.close();
  worker.shutdown();
  await workerRunPromise;
});
