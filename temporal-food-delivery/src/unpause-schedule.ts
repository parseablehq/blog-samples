import { Connection, Client } from '@temporalio/client';

async function run() {
  const client = new Client({
    connection: await Connection.connect(),
  });

  const handle = client.schedule.getHandle(process.argv[2]);
  await handle.unpause();

  console.log(`Schedule is now unpaused.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
