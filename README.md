# VR Release Helper

VR is a CLI tool to automate cherry-picking of PRs tagged with specific features to create release branches efficiently.

## Features

- Automates the cherry-pick process based on PR tags.
- Supports multiple tags and atomic conflict resolution.
- Provides a progress bar and manual conflict handling.
- Allows pushing the release branch to remote repositories.

## Prerequisites

- **Node.js**: VR Release Helper requires **Node.js version 18 or higher**. Please ensure you are using Node.js 18+ before installation.

You can verify your Node.js version by running:

```bash
node -v
```

## Installation

To install VR, use npm:

```bash
npm install -g release-vr
```

## Usage

1. **Navigate to the Repository**: Open a terminal and navigate to the root directory of the repository where you want to perform cherry-picking operations.

2. **Run the Command**:
   ```
   release-vr
   ```
   OR
   ```
   npx release-vr
   ```

## Provide Required Details:

`Base Branch`: Enter the branch name where the original pull requests were merged (e.g., dev). VR Release Helper will validate that this branch exists.

`Target Branch`: Specify the branch where the cherry-pick commits will go (e.g., preprod). VR Release Helper will validate that this branch exists as well.

`Release Branch`: Define a new branch name that will be created from the target branch where all cherry-picks will be applied (e.g., release-preprod). This name must be unique, and VR Release Helper will prompt you to choose a different name if it’s already in use.
