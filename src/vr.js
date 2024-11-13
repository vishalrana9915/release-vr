#!/usr/bin/env node

import inquirer from "inquirer";
import { branchExists, initCherryPick } from "./cherryPick";
import logger from "./logger";

async function main() {
  logger.info(`
  ---------------------------------------------------------------------------------------------
    Welcome to the Release-VR helper CLI! \n
    Release-VR uses the local git setup to cherry-pick changes from one branch to another. \n
    This CLI will guide you through the process of setting up the initial branching. \n
    Let's get started! \n
  ---------------------------------------------------------------------------------------------
  `);

  // Example CLI prompt to set up initial branching
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "baseBranch",
      message: "Enter the base branch to search for tags (e.g., dev):",
      default: "dev",
      validate: async (input) => {
        if (!input) {
          return `${input} is not a valid branch name.`;
        }
        const isBranchValid = await branchExists(input);
        return isBranchValid ? true : `${input} branch does not exist.`;
      },
    },
    {
      type: "input",
      name: "targetBranch",
      message: "Enter the target branch to cherry-pick to (e.g., preprod):",
      default: "preprod",
      validate: async (input) => {
        if (!input) {
          return `${input} is not a valid branch name.`;
        }
        const isBranchValid = await branchExists(input);
        return isBranchValid ? true : `${input} branch does not exist.`;
      },
    },
    {
      type: "input",
      name: "releaseBranch",
      message:
        "Enter the release branch to add the cherry-pick to (e.g., release/preprod-TEST1):",
      default: "preprod-TEST1",
      validate: async (input) => {
        if (!input) {
          return `${input} is not a valid branch name.`;
        }
        const isBranchValid = await branchExists(input);
        return isBranchValid ? `${input} branch already exist.` : true;
      },
    },
    {
      type: "input",
      name: "tags",
      message:
        "Enter the tags separated by spaces to cherry-pick from (e.g., TICKET-123 TICKET-234):",
      default: "TICKET-123 TICKET-234",
    },
    {
      type: "list",
      name: "service",
      message: "Which service are you using?",
      choices: ["GITHUB", "BITBUCKET", "GITLAB"],
      default: "GITHUB",
    },
    {
      type: "list",
      name: "commitOrderPreference",
      message: "Choose the order for cherry-picking commits:",
      choices: [
        {
          name: "Order by Tags (process commits for each tag sequentially)",
          value: "tagOrder",
        },
        {
          name: "Order by Timestamp (process commits in chronological order)",
          value: "timestampOrder",
        },
      ],
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Does the above information look correct?",
      default: true,
    },
  ]);

  // Placeholder function to begin cherry-pick process
  initCherryPick(answers);
}

main().catch((err) => {
  console.error("Error: ", err.message);
  process.exit(1);
});
