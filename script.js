// Set initial rules and pattern
const N = 300;
const color = 3;
// let rule = 2442342343423;
// let rule = 1442342342423423;
let rule = 1442442000000744;
let ruleTmp = rule;
const one_side_rule = rule.toString(2).slice(-1)[0];

const rule_kernel = [2, 10, 2];
const biases = [0];

// Initialize variables
let rule_dynamic;
let previous;
let current;

// Get the container
const container = document.getElementById("container");

const newRule = {};
const rule_bin = ("0".repeat(color ** 3) + rule.toString(color)).slice(
  -(color ** 3)
);
for (let i = 0; i < color ** 3; i++) {
  newRule[("0".repeat(3) + i.toString(color)).slice(-3)] = rule_bin[i];
}
console.log(newRule);

const dynamic_rule = [];
for (let i = 0; i < N; i++) {
  dynamic_rule.push({
    ...newRule,
  });
}

function init() {
  // initialize variables
  rule_dynamic = new Array(N).fill(rule);
  previous = [];
  for (let i = 0; i < N; i++) {
    // push random number from 0 to ffffff
    previous.push(Math.floor(Math.random() * color).toString());
  }
  current = [];

  // Clear the container
  container.innerHTML = "";
}

function softmax(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += Math.exp(arr[i]);
  }
  return arr.map((v) => Math.exp(v) / sum);
}

// Function to calculate the next cell based on the rule
function cell_automaton(pattern, rule) {
  return rule[pattern];
}

// Function to update the rule
function update_rule(index, pattern, value, one_side_only) {
  let value_bin = value;
  if (one_side_only) {
    value_bin = one_side_rule;
  }
  let local_rule = rule_dynamic[index];
  local_rule[pattern] = value_bin;
}

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
    let one_side_only = false;
    let active = true;

    let previous_cell = previous[(j - 1 + N) % N];
    let next_cell = previous[(j + 1 + N) % N];

    // if the left value is not null, set the previous cell to the left value
    if (current[(j - 1 + N) % N]) {
      previous_cell = current[(j - 1 + N) % N];
      active = false;
      one_side_only = true;
    }

    // if the right value is not null, set the next cell to the right value
    if (current[(j + 1 + N) % N]) {
      active = false;
      next_cell = current[(j + 1 + N) % N];
      one_side_only = one_side_only ? false : true;
    }

    // calculate the current cell
    current[j] = cell_automaton(
      previous_cell + previous[j] + next_cell,
      active ? dynamic_rule[j] : newRule
    );

    if (!active)
      update_rule(
        j,
        previous[(j - 1 + N) % N] + previous[j] + previous[(j + 1 + N) % N],
        current[j],
        one_side_only
      );
  }

  // console.log("current: " + current);
  // current = softmax(current);

  // update the UI
  for (let j = 0; j < N; j++) {
    const newCell = document.createElement("div");
    newCell.className = "cell";
    switch (current[j]) {
      case "0":
        newCell.style.backgroundColor = "rgb(244, 241, 222)";
        break;
      case "1":
        newCell.style.backgroundColor = "rgb(223, 122, 94)";
        break;
      case "2":
        newCell.style.backgroundColor = "rgb(60, 64, 91)";
        break;
      case "3":
        newCell.style.backgroundColor = "green";
        break;
    }
    // console.log(current[j]);
    // console.log("#" + Math.floor(current[j]).toString(16));
    // if (current[j] > 0.1) {
    //   newCell.style.height = "100px";
    //   console.log("height: 100px");
    // }
    newRow.appendChild(newCell);
    previous[j] = current[j];
    current[j] = null;
  }
  // console.log("current sum: " + current_sum);
  window.scrollTo(0, document.body.scrollHeight);
}

// Initialize the variables
init();

updateUI();
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
});

const ruleButton = document.getElementById("ruleButton");
ruleButton.addEventListener("click", () => {
  if (ruleTmp < 0 || ruleTmp > 255) {
    alert("Invalid rule");
    return;
  }
  rule = ruleTmp;
  clearInterval(intervalId);
  init();

  intervalId = setInterval(updateUI, 100);
});
