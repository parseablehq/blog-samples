import { Connection, Client } from '@temporalio/client';

async function run() {
  const client = new Client({
    connection: await Connection.connect(),
  });

  const handle = client.schedule.getHandle(process.argv[2]);
  await handle.delete();

  console.log(`Schedule is now deleted.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
