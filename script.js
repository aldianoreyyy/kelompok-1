const display = document.querySelector(".display-number");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalButton = document.querySelector(".equal");
const plusButton = document.querySelector(".plus");

const state = {
  currentNumber: "0",
  previousNumber: null,
  currentOperator: null,
  memory: 0,
  grandTotal: 0,
  history: []
};

const updateDisplay = () => {
  display.textContent = state.currentNumber;
};

const formatNumber = (number) =>
  Number.isFinite(number) ? Number(number.toFixed(10)).toString() : "Error";

const inputNumber = (number) => {
  if (state.currentNumber === "Error") state.currentNumber = "0";
  state.currentNumber = state.currentNumber === "0" && number !== "." ? number : state.currentNumber + number;
  updateDisplay();
};

const inputDecimal = () => {
  if (state.currentNumber === "Error") state.currentNumber = "0";
  if (state.currentNumber.includes(".")) return;
  state.currentNumber += ".";
  updateDisplay();
};

const chooseOperator = (operator) => {
  if (state.currentNumber === "Error") return;
  if (state.previousNumber !== null && state.currentOperator !== null) calculate();

  state.previousNumber = Number(state.currentNumber);
  state.currentOperator = operator;
  state.currentNumber = "0";
  updateDisplay();
};

const calculate = () => {
  if (state.previousNumber === null || state.currentOperator === null || state.currentNumber === "Error") return;

  const current = Number(state.currentNumber);
  const previous = state.previousNumber;
  const operator = state.currentOperator;

  if (operator === "÷" && current === 0) {
    state.currentNumber = "Error";
    state.previousNumber = null;
    state.currentOperator = null;
    updateDisplay();
    alert("Tidak bisa membagi dengan 0!");
    return;
  }

  const result = formatNumber(
    operator === "+" ? previous + current :
    operator === "-" ? previous - current :
    operator === "×" ? previous * current :
    previous / current
  );

  state.history.push(`${previous} ${operator} ${current} = ${result}`);
  state.grandTotal += Number(result);
  state.currentNumber = result;
  state.previousNumber = null;
  state.currentOperator = null;
  updateDisplay();
};

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();
    value === "." ? inputDecimal() : inputNumber(value);
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();
    chooseOperator(value);
  });
});

plusButton.addEventListener("click", () => chooseOperator("+"));
equalButton.addEventListener("click", calculate);

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (key === "+") chooseOperator("+");
  else if (key === "-") chooseOperator("-");
  else if (key === "*") chooseOperator("×");
  else if (key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (key === "Enter" || key === "=") calculate();
});