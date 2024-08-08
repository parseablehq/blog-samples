import { Connection, Client, ScheduleOverlapPolicy } from '@temporalio/client';
import { orderWorkflow } from './workflows';

async function run() {
  const client = new Client({
    connection: await Connection.connect(),
  });

  const schedule = await client.schedule.create({
    action: {
      type: 'startWorkflow',
      workflowType: orderWorkflow,
      taskQueue: 'schedules',
    },
    scheduleId: `order-schedule-${Math.round(Math.random() * 1000).toString()}`,
    policies: {
      catchupWindow: '1 day',
      overlap: ScheduleOverlapPolicy.ALLOW_ALL,
    },
    spec: {
      intervals: [{ every: '10s' }], // Increased frequency
    },
  });

  console.log(`Started schedule '${schedule.scheduleId}'.

The order Workflow will run and log from the Worker every 5 seconds.

You can now run:

  npm run schedule.go-faster
  npm run schedule.pause
  npm run schedule.unpause
  npm run schedule.delete
  `);

  await client.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
