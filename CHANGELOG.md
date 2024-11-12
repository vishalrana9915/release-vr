# Changelog

## [1.0.0] - 2024-11-11

**Initial Release of VR Release Helper**  
A CLI tool designed to streamline cherry-pick workflows and automate release processes by identifying feature tags within PR descriptions.

### Key Features

- **Automated Cherry-Picking Based on Feature Tags**  
  Simplifies release preparation by automatically cherry-picking commits associated with specific tags (e.g., `make-soup`, `make-milkshake`). Users can specify multiple tags to batch-select features for cherry-picking at once.

- **User-Prompted Conflict Resolution**  
  Automatically detects conflicts during cherry-picks and prompts the user to resolve them manually. Once conflicts are resolved and staged, the tool resumes cherry-picking from the paused state. Optional **atomic behavior** allows users to reset branches if any conflict occurs, or continue if conflicts are successfully resolved.

- **Automatic Handling of Empty Cherry-Picks**  
  Automatically skips empty cherry-picks, which occur if the target branch already includes the changes. This prevents interruptions when applying feature tags across branches with existing changes.

- **Customizable Branch Selection**  
  Allows users to specify the base branch (e.g., `dev`) for identifying commits to cherry-pick and set the target branch (e.g., `preprod`) where the cherry-picks will be applied. Users can also define a new release branch (e.g., `release-preprod`) from which a pull request will be created to the target branch.

- **Serial Execution of Cherry-Picks by Feature Tag**  
  Processes cherry-pick operations in the order specified by tags, applying changes for each tag sequentially to ensure a logical feature deployment order.

- **Progress Monitoring**  
  Displays a progress bar to track cherry-pick operations, giving users visibility into the process and estimated time to completion.

- **Merged PRs and Revert Handling**  
  Filters only merged PRs with the specified tags to ensure stable, completed changes are cherry-picked. Additionally, identifies any reverted commits to prevent reintroducing changes that have already been reversed in the target branch.

- **Local Git Permissions**  
  Leverages the local repository’s Git access without requiring additional credentials, simplifying command execution directly within the user’s environment.

- **Optional Release Branch Push**  
  Users can choose to push the new release branch directly to the remote repository or manage this step manually, adding flexibility to the deployment process.

### Technical Improvements

- **Babel Setup for ES Module Support**  
  Configured Babel to enable ES module imports, allowing for modern JavaScript syntax across the project.

- **Development Mode Support**  
  Enables users to run the code in development mode without rebuilding, facilitating faster testing and iteration.

### Enhanced Logging

- **Robust Logging for Process Transparency**  
  A logger provides detailed output throughout the workflow, including cherry-pick success messages, conflict alerts, and error reporting to streamline troubleshooting and enhance process visibility.

### Installation and Deployment

- **Published as an NPM Package**  
  Available on NPM for easy installation and integration. Users can install VR Release Helper and run commands directly within their local environments for immediate use.

## [1.0.1] - 2024-11-11

**Enhancements to Commit Filtering and Exact Tag Matching**

### Key Updates

- **Removed `--merges` Flag from Git Log Commands**  
  In response to compatibility issues with the `--merges` flag, this release removes the use of the `--merges` flag for filtering merge commits. This change improves compatibility across different repositories and simplifies the commit fetching logic.

- **Exact Match Functionality for Tags**  
  Implemented a more robust and precise commit filtering mechanism that uses regular expressions to ensure an **exact match** for the specified tags in commit messages. The `\b` word boundary regex is applied to tag searches, ensuring that partial matches (e.g., `109` matching `1093` or `1099`) are excluded.

### Benefits

- **More Accurate Tag Filtering**: The exact match functionality ensures that only commits containing the exact tag will be included, improving search accuracy.
- **Improved Compatibility**: The removal of the `--merges` flag resolves issues with Git in certain environments where the flag wasn't functioning as expected.

### Bug Fixes

- **Fixed Inconsistent Merge Commit Detection**: In some cases, the tool failed to detect merge commits correctly. The new post-processing logic ensures that merged commits with the correct tags are captured, even without `--merges`.

## [1.0.2] - 2024-11-12

### Added

- **Branch Validation**: Added validation to ensure that the specified base and target branches exist in the repository.
- **Release Branch Validation**: Enhanced branch creation process by checking if the specified release branch already exists, preventing accidental overwrites.
- **Automatic Empty Cherry-Pick Skip**: Automated handling of empty cherry-picks by skipping them automatically, removing the need for user intervention.

### Updated

- **README**: Updated to include detailed instructions for installation, usage, and feature descriptions, with examples and troubleshooting tips.
- **Inquirer Validation for Branches**: Improved user experience by implementing validation directly within inquirer prompts to provide real-time feedback on branch existence.
- **Different pr search criteria for GITHUB/BITBUCKET**: Improvede the search for tags based on the service provider.

### Fixed

- **Git Merge Flag Compatibility**: Removed the `--merges` flag to improve compatibility across Git providers, such as Bitbucket.
- **Cherry-Pick Error Handling**: Resolved an issue where empty cherry-picks could interrupt the cherry-picking process by auto-skipping empty commits.

---

## [1.0.3] - 2024-11-12

### Updated

- **PACKAGE** : Removed reference of chalk module as not being used.
