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


const calculatePercent = () => {
  if (state.currentNumber === "Error") return;
  const number = Number(state.currentNumber);
  state.currentNumber = formatNumber(
    state.previousNumber !== null ? (state.previousNumber * number) / 100 : number / 100
  );
  updateDisplay();
};

const clearCalculator = () => {
  state.currentNumber = "0";
  state.previousNumber = null;
  state.currentOperator = null;
  updateDisplay();
};

const markUp = () => {
  if (state.previousNumber === null) return;

  const percentage = Number(state.currentNumber);
  const result = state.previousNumber + (state.previousNumber * percentage / 100);
  state.currentNumber = formatNumber(result);
  state.history.push(`${state.previousNumber} + ${percentage}% = ${state.currentNumber}`);
  state.grandTotal += Number(state.currentNumber);
  state.previousNumber = null;
  state.currentOperator = null;
  updateDisplay();
};

const memoryPlus = () => {
  const number = Number(state.currentNumber);
  if (Number.isFinite(number)) state.memory += number;
};

const memoryMinus = () => {
  const number = Number(state.currentNumber);
  if (Number.isFinite(number)) state.memory -= number;
};

const memoryRecall = () => {
  if (state.memory !== 0) {
    state.currentNumber = formatNumber(state.memory);
  } else {
    state.memory = 0;
  }
  updateDisplay();
};

const grandTotalFunction = () => {
  state.currentNumber = formatNumber(state.grandTotal);
  updateDisplay();
};

const showHistory = () => {
  if (state.history.length === 0) {
    alert("Belum ada riwayat perhitungan.");
    return;
  }

  const historyText = state.history.slice(-10).reverse().join("\n");
  alert("RIWAYAT PERHITUNGAN\n\n" + historyText);
};