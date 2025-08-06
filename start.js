import fs from "fs";
import path from "path";

async function copyFolder(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying folder from ${src} to ${dest}:`, err);
  }
}

async function copyFile(src, dest) {
  try {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);

    console.log(`File copied from ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying file from ${src} to ${dest}:`, err);
  }
}

const accountsSrc = path.join(process.cwd(), "accounts");
const configSrc = path.join(process.cwd(), "config.js");
const accountsDest = path.join(process.cwd(), "app", "accounts");
const configDest = path.join(process.cwd(), "app", "config.js");

(async () => {
  await copyFolder(accountsSrc, accountsDest);
  await copyFile(configSrc, configDest);

  console.log("Starting the app...");
  console.log();
  await import("./app/index.js");
})();
