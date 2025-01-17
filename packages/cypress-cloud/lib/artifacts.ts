import Debug from "debug";
import { ScreenshotArtifact, ScreenshotUploadInstruction } from "../types";
import { updateInstanceStdout } from "./api";
import { safe } from "./lang";
import { warn } from "./log";
import { uploadFile } from "./upload";
const debug = Debug("currents:artifacts");
interface UploadArtifacts {
  videoPath: string | null;
  videoUploadUrl?: string | null;
  screenshots: ScreenshotArtifact[];
  screenshotUploadUrls: ScreenshotUploadInstruction[];
}
export async function uploadArtifacts({
  videoPath,
  videoUploadUrl,
  screenshots,
  screenshotUploadUrls,
}: UploadArtifacts) {
  // title("blue", "Uploading  Results");

  debug("uploading artifacts: %o", {
    videoPath,
    videoUploadUrl,
    screenshots,
    screenshotUploadUrls,
  });

  const totalUploads = (videoPath ? 1 : 0) + screenshots.length;
  if (totalUploads === 0) {
    // info("Nothing to upload");
    return;
  }

  // upload video
  if (videoUploadUrl && videoPath) {
    await safe(
      uploadFile,
      // () => info("- Failed Uploading", red(videoPath)),
      // () => info("- Done Uploading", cyan(videoPath))
      () => {},
      () => {}
    )(videoPath, videoUploadUrl);
  }
  // upload screenshots
  if (screenshotUploadUrls.length) {
    await Promise.all(
      screenshots.map((screenshot) => {
        const url = screenshotUploadUrls.find(
          (urls) => urls.screenshotId === screenshot.screenshotId
        )?.uploadUrl;
        if (!url) {
          debug(
            "No upload url for screenshot %o, screenshotUploadUrls: %o",
            screenshot,
            screenshotUploadUrls
          );
          warn("Cannot find upload url for screenshot: %s", screenshot.path);
          return Promise.resolve();
        }
        return safe(
          uploadFile,
          // () => warn("- Failed Uploading", red(screenshot.path)),
          // () => info("- Done Uploading", cyan(screenshot.path))
          () => {},
          () => {}
        )(screenshot.path, url);
      })
    );
  }
}

export const uploadStdoutSafe = safe(
  updateInstanceStdout,
  () => {},
  () => {}
);
