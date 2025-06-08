import { Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/order.workflow'),
    activities: require('./activities/order.activities'),
    taskQueue: 'order',
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
