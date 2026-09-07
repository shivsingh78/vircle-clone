const API_URL =
  process.env.SHIPFLOW_API_URL ||
  "http://localhost:8000";

/**
 * Create a new release.
 */
export async function createRelease(repoUrl) {
  const response = await fetch(
    `${API_URL}/deploy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoUrl,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `ShipFlow API failed: ${response.status} ${body}`
    );
  }

  return await response.json();
}

/**
 * Get the current state of a release.
 */
export async function getReleaseStatus(
  releaseId
) {
  const response = await fetch(
    `${API_URL}/releases/${releaseId}`
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Failed to fetch release: ${response.status} ${body}`
    );
  }

  return await response.json();
}