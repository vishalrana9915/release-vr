import simpleGit from "simple-git";
import logger from "./logger";
import { createProgressBar } from "./progress";
import inquirer from "inquirer";

const git = simpleGit(process.cwd());

/**
 * Function to check if the branch exists
 * @param {*} branchName , name of the branch
 * @returns {Promise<boolean>}
 */
const branchExists = async (branchName) => {
  const branches = await git.branch();
  return branches.all.includes(branchName);
};

/**
 * Prompts the user to press Enter to continue after resolving conflicts.
 * @returns {Promise<void>}
 */
const promptToContinue = async () => {
  await inquirer.prompt([
    {
      type: "confirm",
      name: "continue",
      message:
        "Conflicts detected. Please resolve conflicts, stage the changes, and press Enter to continue...",
      default: true,
    },
  ]);
};

/**
 * Cherry-pick a commit with conflict handling.
 * @param {string} commitHash - The hash of the commit to cherry-pick.
 * @param {number} parentNumber - The parent number for merge commits (1 or 2).
 * @returns {Promise<void>}
 */
async function cherryPickWithConflictHandling(commitHash, parentNumber = 1) {
  try {
    await git.raw(["cherry-pick", "-m", parentNumber.toString(), commitHash]);
    logger.info(`Successfully cherry-picked commit: ${commitHash}`);
  } catch (error) {
    logger.error(`Error during cherry-pick: ${error.message}`);
    if (error.message.includes("conflict")) {
      logger.info("Conflict detected during cherry-pick!");
      logger.info(
        "<== Please resolve the conflicts manually. If cherry-pick is just empty, please skip it by pressing enter ==>>>."
      );

      // Wait for the user to resolve conflicts and continue
      await promptToContinue();

      // Verify if conflicts are resolved and continue
      const status = await git.status();
      if (status.conflicted.length === 0) {
        try {
          await git.raw(["cherry-pick", "--continue"]);
          logger.info("Cherry-pick completed after conflict resolution.");
        } catch (err) {
          // Handle empty cherry-pick case
          if (err.message.includes("empty")) {
            logger.info(
              "No changes detected after conflict resolution. Skipping this cherry-pick."
            );
            await git.raw(["cherry-pick", "--skip"]);
          } else {
            throw err;
          }
        }
      } else {
        logger.info(
          "Conflicts still present. Please resolve all conflicts and retry."
        );
      }
    } else if (error.message.includes("empty")) {
      logger.info("No changes detected. Skipping empty cherry-pick.");
      await git.raw(["cherry-pick", "--skip"]);
    } else {
      logger.error(`Error during cherry-pick: ${error.message}`);
      await git.raw(["cherry-pick", "--abort"]);
      logger.log("Cherry-pick aborted due to an error.");
    }
  }
}

/**
 * Get all commits related to the tags
 * @param {*} tags
 * @returns {Promise<Object>}
 */
const getCommitsForTag = async (tags, service) => {
  let obj = {};

  for (let tag of tags) {
    // Prepare the grep options by including each tag
    const grepOptions = {
      "--grep": `\\b${tag}\\b`,
    };

    if (service == "BITBUCKET") {
      grepOptions["--merges"] = null;
    }

    const match = await git.log(grepOptions);
    obj[tag] = match?.all;
  }

  return obj;
};

/**
 * Function to start the cherry-pick process
 * @param {*} param0
 */
async function initCherryPick({
  baseBranch,
  targetBranch,
  releaseBranch,
  tags,
  confirm,
  service,
}) {
  logger.info(
    `Starting cherry-pick from ${baseBranch} to ${targetBranch} for tags: ${tags.split(
      " "
    )}`
  );

  let currentBranch = await git.status();
  // console.log(currentBranch);
  currentBranch = currentBranch.current;
  console.log("Print current branch ==>", currentBranch);
  // Placeholder for actual cherry-pick logic
  // We'll expand this to identify PRs, filter based on tags, and handle conflicts.
  try {
    if (!confirm) {
      logger.error(`No Confirmed .`);
      process.exit(1);
    }

    // start with cherry pick the commits from the base branch
    const tagsSplit = tags.split(" ");
    if (!tagsSplit?.length) {
      logger.info(
        `No tag to mention the Cherry-picking completed for release branch ${releaseBranch}.`
      );
      process.exit(0);
    }

    await git.fetch();
    logger.info("Fetched the latest changes.");

    // checkout to branch
    await git.checkout(baseBranch);
    logger.info(`Checked out to base branch ${baseBranch}.`);

    // make the base branch up-to-date
    await git.pull();

    // get all commits related to tags
    const tagsMappingCommit = await getCommitsForTag(tagsSplit, service);
    console.log(tagsMappingCommit);

    // checkout to the base branch
    await git.checkout(targetBranch);
    logger.info(`Checked out to target branch ${baseBranch}.`);

    // pull the latest changes
    await git.pull();

    // create a new branch from the base branch
    await git.checkoutBranch(releaseBranch, targetBranch);
    logger.info(
      `Created and checked out to release branch ${releaseBranch} from ${targetBranch}.`
    );

    const progressBar = createProgressBar(tagsSplit.length);
    progressBar.start();
    let increment = Math.floor(100 / tagsSplit.length);

    for (let key of Object.keys(tagsMappingCommit)) {
      const commits = tagsMappingCommit[key];
      if (commits.length) {
        for (let commit of commits) {
          await cherryPickWithConflictHandling(commit.hash);
          logger.info(
            `Cherry-picking commit ${commit.hash} under ${key} done.`
          );
        }
      }
      progressBar.increment(increment);
    }

    progressBar.stop();
  } catch (err) {
    console.log(err);
    await git.checkout(currentBranch);
    await git.deleteLocalBranch(releaseBranch);
    logger.error(
      `Please check if the release branch still exist, delete it manually.`
    );
    process.exit(1);
  }
}

module.exports = { initCherryPick, branchExists };
