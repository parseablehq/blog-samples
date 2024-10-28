import * as Minio from "minio";
import { faker } from "@faker-js/faker";
import * as fs from "fs";

const minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: "nrt7x6DS7zfIEWV1g58Z", // Change to yours
  secretKey: "9a3q5qWFyHvozVFLMSeFftpgX2HBTwjTtRcCsXZN", // Change to yours
});

const loopLength = faker.number.int({ min: 10, max: 100 });

for (let index = 0; index < loopLength; index++) {
  const randomText = faker.lorem.lines({ min: 100, max: 1000 });

  // Destination object name
  const destinationObject = faker.system.commonFileName("txt");
  // File to upload
  const sourceFile = `files/${destinationObject}`;

  // Write data in 'Output.txt' .
  fs.writeFile(sourceFile, randomText, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });

  // Destination bucket
  const bucket = "js-test-bucket";

  // Check if the bucket exists
  // If it doesn't, create it
  const exists = await minioClient.bucketExists(bucket);
  if (exists) {
    console.log("Bucket " + bucket + " exists.");
  } else {
    await minioClient.makeBucket(bucket, "us-east-1");
    console.log("Bucket " + bucket + ' created in "us-east-1".');
  }

  // Set the object metadata
  var metaData = {
    "Content-Type": "text/plain",
    "X-Amz-Meta-Testing": faker.number.int({ max: 100 }),
    example: faker.number.int({ max: 200 }),
  };

  // Upload the file with fPutObject
  // If an object with the same name exists,
  // it is updated with new data
  await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData);
  console.log(
    "File " +
      sourceFile +
      " uploaded as object " +
      destinationObject +
      " in bucket " +
      bucket
  );

  try {
    fs.unlinkSync(sourceFile);

    console.log(`Deleted ${sourceFile}`);
  } catch (err) {
    console.log("An error occurred: ", err.message);
  }
}
