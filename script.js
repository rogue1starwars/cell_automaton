// Set initial rules and pattern
const N = 300;
let rule = 14;
let ruleTmp = 14;
const one_side_rule = rule.toString(2).slice(-1)[0];

// Adding dynamic rules
const rule_dynamic = new Array(N).fill(rule);

const previous = [];
for (let i = 0; i < N; i++) {
  previous.push(Math.random() < 0.5 ? "1" : "0");
}

const current = [];

// Function to calculate the next cell based on the rule
function cell_automaton(pattern, rule) {
  const n = pattern.length;
  const pattern_dec = parseInt(pattern, 2); // Convert binary pattern to decimal
  const rule_bin = ("0".repeat(2 ** n) + rule.toString(2)).slice(-(2 ** n)); // convert decimal rule to binary

  const next_cell = rule_bin[2 ** n - pattern_dec - 1];
  return next_cell;
}

function update_rule(index, pattern, value, one_side_only) {
  console.log("value: " + value);
  let value_bin = value;
  if (one_side_only) {
    value_bin = one_side_rule;
  }
  let local_rule = rule_dynamic[index];
  let local_rule_bin = ("0".repeat(2 ** 3) + local_rule.toString(2)).slice(
    -(2 ** 3)
  );
  let pattern_dec = parseInt(pattern, 2);
  local_rule_bin =
    local_rule_bin.slice(0, 2 ** 3 - pattern_dec - 1) +
    value_bin +
    local_rule_bin.slice(2 ** 3 - pattern_dec);
  rule_dynamic[index] = parseInt(local_rule_bin, 2);
  console.log(rule_dynamic[index]);
}

// Create the UI
const container = document.getElementById("container");

function updateUI() {
  const newRow = document.createElement("div");
  newRow.className = "row";
  container.appendChild(newRow);
  const completed = [];
  for (let i = 0; i < N; i++) {
    // set j to a random number between 0 and N
    let j;
    while (true) {
      j = Math.floor(Math.random() * N);
      if (completed.indexOf(j) === -1) {
        completed.push(j);
        break;
      }
    }
    console.log("j: " + j);
    let one_side_only = false;
    let active = true;

    let previous_cell = previous[(j - 1 + N) % N];
    let next_cell = previous[(j + 1 + N) % N];
    if (current[(j - 1 + N) % N]) {
      previous_cell = current[(j - 1 + N) % N];
      active = false;
      one_side_only = true;
      console.log("previous_cell: " + previous_cell);
    }
    if (current[(j + 1 + N) % N]) {
      active = false;
      next_cell = current[(j + 1 + N) % N];
      one_side_only = one_side_only ? false : true;
      console.log("next_cell: " + next_cell);
    }
    current[j] = cell_automaton(
      previous_cell + previous[j] + next_cell,
      active ? rule_dynamic[j] : rule
    );
    console.log("current[j]: " + current[j]);
    console.log("one_side_only: " + one_side_only);
    console.log("active: " + active);

    if (!active)
      update_rule(
        j,
        previous[(j - 1 + N) % N] + previous[j] + previous[(j + 1 + N) % N],
        current[j],
        one_side_only
      );
  }

  for (let j = 0; j < N; j++) {
    const newCell = document.createElement("div");
    newCell.className = "cell";
    newCell.style.backgroundColor = current[j] === "1" ? "black" : "white";
    newRow.appendChild(newCell);
    previous[j] = current[j];
    current[j] = null;
  }
  window.scrollTo(0, document.body.scrollHeight);
}

let intervalId = setInterval(updateUI, 100);

const startButton = document.getElementById("startButton");
let toggle = true;
startButton.addEventListener("click", () => {
  if (toggle) {
    clearInterval(intervalId);
  } else {
    intervalId = setInterval(updateUI, 100);
  }
  toggle = !toggle;
});

const ruleInput = document.getElementById("ruleInput");
ruleInput.addEventListener("input", () => {
  ruleTmp = parseInt(ruleInput.value);
  console.log(rule);
});

const ruleButton = document.getElementById("ruleButton");
ruleButton.addEventListener("click", () => {
  console.log("clicked");
  if (ruleTmp < 0 || ruleTmp > 255) {
    alert("Invalid rule");
    return;
  }
  rule = ruleTmp;
  clearInterval(intervalId);
  container.innerHTML = "";
  intervalId = setInterval(updateUI, 100);
  console.log(rule_dynamic);
});
