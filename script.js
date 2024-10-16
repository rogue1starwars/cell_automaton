const N = 10;
let rule = 30;

const previous = ["0", "0", "0", "0", "1", "1", "0", "0", "0", "0"];
const current = [];

function cell_automaton(pattern, rule) {
  const n = pattern.length;
  pattern_dec = parseInt(pattern, 2); // Convert binary pattern to decimal
  rule_bin = ("0".repeat(2 ** n) + rule.toString(2)).slice(-(2 ** n)); // convert decimal rule to binary

  const next_cell = rule_bin[2 ** n - pattern_dec - 1];
  return next_cell;
}

const container = document.getElementById("container");

function updateUI() {
  const newRow = document.createElement("div");
  newRow.className = "row";
  container.appendChild(newRow);
  for (let j = 0; j < N; j++) {
    current[j] = cell_automaton(
      previous[(j - 1 + N) % N] + previous[j] + previous[(j + 1 + N) % N],
      rule
    );
    const newCell = document.createElement("div");
    newCell.className = "cell";
    newCell.style.backgroundColor = current[j] === "1" ? "black" : "white";
    newRow.appendChild(newCell);
    console.log(current[j]);
  }

  for (let j = 0; j < N; j++) {
    previous[j] = current[j];
  }
}

setInterval(updateUI, 1000);
