import { Worker } from "bullmq";
import IORedis from "ioredis";
import { testRelease } from "./src/test.js";

import { getRelease, updateRelease } from "./src/releaseStore.js";

import { prepareRelease } from "./src/prepare.js";
import { buildRelease } from "./src/build.js";
import { deployRelease } from "./src/deploy.js";
import { verifyRelease } from "./src/verify.js";
import { notifyRelease } from "./src/notify.js";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
});
import { runPipeline } from "./src/pipeline.js";

const worker = new Worker(
  "deployment-queue",
  async (job) => {
    const {
      releaseId,
      repoUrl,
    } = job.data;

    console.log(
      `Processing release: ${releaseId}`
    );

    return await runPipeline({
      releaseId,
      repoUrl,
    });
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`);
  console.error(err);
});

console.log("🚀 Deployment worker started");

// const worker = new Worker(
//   "deployment-queue",
//   async (job) => {
//     console.log("Processing deployment job...");
//     console.log("Job ID:", job.id);
//     console.log("Deployment ID:", job.data.id);

//     const id = job.data.id;

//     // This is where the actual deployment logic
//     // will happen.

//     console.log(`Deployment ${id} processed successfully`);

//     return {
//       success: true,
//       id,
//     };
//   },
//   {
//     connection,
//   }
// );
