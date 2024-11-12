import { SingleBar, Presets } from "cli-progress";

export function createProgressBar(total) {
  const progressBar = new SingleBar(
    {
      format:
        "Progress |" + "{bar}" + "| {percentage}% || {value}/{total} Tags",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    },
    Presets.shades_classic
  );

  progressBar.start(total, 0);
  return progressBar;
}
