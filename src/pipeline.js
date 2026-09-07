import { prepareRelease } from "./prepare.js";
import { buildRelease } from "./build.js";
import { testRelease } from "./test.js";
import { deployRelease } from "./deploy.js";
import { verifyRelease } from "./verify.js";
import { notifyRelease } from "./notify.js";

import {
  getRelease,
  updateRelease,
} from "./releaseStore.js";

export async function runPipeline({
  releaseId,
  repoUrl,
}) {
  let currentStage = "RELEASE";

  try {
    const release = await getRelease(
      releaseId
    );

    if (!release) {
      throw new Error(
        `Release ${releaseId} not found`
      );
    }

    // -----------------------
    // PREPARE
    // -----------------------

    currentStage = "PREPARE";

    await updateRelease(releaseId, {
      status: "RUNNING",
      currentStage,
      errorMessage: null,
    });

    const prepared =
      await prepareRelease({
        releaseId,
        repoUrl,
      });

    // -----------------------
    // BUILD
    // -----------------------

    currentStage = "BUILD";

    await updateRelease(releaseId, {
      status: "RUNNING",
      currentStage,
      errorMessage: null,
    });

    const built =
      await buildRelease({
        releaseId,
        workspacePath:
          prepared.workspacePath,
      });

    // -----------------------
    // TEST
    // -----------------------

    currentStage = "TEST";

    await updateRelease(releaseId, {
      status: "RUNNING",
      currentStage,
      errorMessage: null,
    });

    const tested =
      await testRelease({
        releaseId,
        workspacePath:
          built.workspacePath,
      });

    // -----------------------
    // DEPLOY
    // -----------------------

    currentStage = "DEPLOY";

    await updateRelease(releaseId, {
      status: "RUNNING",
      currentStage,
      errorMessage: null,
    });

    const deployed =
      await deployRelease({
        releaseId,
        workspacePath:
          tested.workspacePath,
      });

   await updateRelease(releaseId, {
  status: "RUNNING",
  currentStage: "DEPLOY",
  deploymentUrl: deployed.deploymentUrl,
  publicDeploymentUrl:
    deployed.publicDeploymentUrl,
  artifactPath: deployed.deploymentPath,
  errorMessage: null,
});
    // -----------------------
    // VERIFY
    // -----------------------

    currentStage = "VERIFY";

    await updateRelease(releaseId, {
      status: "RUNNING",
      currentStage,
      errorMessage: null,
    });

    const verified =
      await verifyRelease({
        releaseId,
        deploymentUrl:
          deployed.deploymentUrl,
      });

    // -----------------------
    // SUCCESS
    // -----------------------

    await updateRelease(releaseId, {
      status: "SUCCESS",
      currentStage: "VERIFY",
      errorMessage: null,
    });

    await notifyRelease({
      releaseId,
      type: "RELEASE_SUCCESS",
      message:
        `Release ${releaseId} successfully deployed and verified.`,
    });

    return {
      success: true,
      releaseId,
      deploymentUrl:
        deployed.deploymentUrl,
      verified,
    };

  } catch (error) {

    console.error(
      `${currentStage} failed for ${releaseId}`,
      error
    );

    await updateRelease(releaseId, {
      status: "FAILED",
      currentStage,
      errorMessage: error.message,
    });

    try {
      await notifyRelease({
        releaseId,
        type: "RELEASE_FAILED",
        message:
          `Release ${releaseId} failed during ${currentStage}: ${error.message}`,
      });
    } catch (notifyError) {
      console.error(
        "Failed to create failure notification:",
        notifyError
      );
    }

    throw error;
  }
}