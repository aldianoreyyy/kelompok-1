const display = document.querySelector(".display-number");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalButton = document.querySelector(".equal");
const plusButton = document.querySelector(".plus");
const memoryButtons = document.querySelectorAll(".memory");
const historyButton = document.querySelector(".history-btn");

const state = {
  currentNumber: "0",
  previousNumber: null,
  currentOperator: null,
  memory: 0,
  grandTotal: 0,

  // Ambil history yang sudah tersimpan
  history: JSON.parse(
    localStorage.getItem("calculatorHistory") || "[]"
  )
};

// Simpan history ke localStorage
const saveHistory = () => {
  localStorage.setItem(
    "calculatorHistory",
    JSON.stringify(state.history)
  );
};

const updateDisplay = () => {
  display.textContent = state.currentNumber;
};

const formatNumber = (number) =>
  Number.isFinite(number)
    ? Number(number.toFixed(10)).toString()
    : "Error";

const inputNumber = (number) => {
  if (state.currentNumber === "Error") {
    state.currentNumber = "0";
  }

  state.currentNumber =
    state.currentNumber === "0" && number !== "."
      ? number
      : state.currentNumber + number;

  updateDisplay();
};

const inputDecimal = () => {
  if (state.currentNumber === "Error") {
    state.currentNumber = "0";
  }

  if (state.currentNumber.includes(".")) return;

  state.currentNumber += ".";
  updateDisplay();
};

const chooseOperator = (operator) => {
  if (state.currentNumber === "Error") return;

  if (
    state.previousNumber !== null &&
    state.currentOperator !== null
  ) {
    calculate();
  }

  state.previousNumber = Number(state.currentNumber);
  state.currentOperator = operator;
  state.currentNumber = "0";

  updateDisplay();
};

const calculate = () => {
  if (
    state.previousNumber === null ||
    state.currentOperator === null ||
    state.currentNumber === "Error"
  ) {
    return;
  }

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
    operator === "+"
      ? previous + current
      : operator === "-"
      ? previous - current
      : operator === "×"
      ? previous * current
      : previous / current
  );

  // Masukkan perhitungan ke history
  state.history.push(
    `${previous} ${operator} ${current} = ${result}`
  );

  // Simpan history
  saveHistory();

  state.grandTotal += Number(result);
  state.currentNumber = result;
  state.previousNumber = null;
  state.currentOperator = null;

  updateDisplay();
};

const calculatePercent = () => {
  if (state.currentNumber === "Error") return;

  const number = Number(state.currentNumber);

  state.currentNumber = formatNumber(
    state.previousNumber !== null
      ? (state.previousNumber * number) / 100
      : number / 100
  );

  updateDisplay();
};

const clearCalculator = () => {
  state.currentNumber = "0";
  state.previousNumber = null;
  state.currentOperator = null;

  updateDisplay();
};

const memoryPlus = () => {
  const number = Number(state.currentNumber);

  if (Number.isFinite(number)) {
    state.memory += number;
  }
};

const memoryMinus = () => {
  const number = Number(state.currentNumber);

  if (Number.isFinite(number)) {
    state.memory -= number;
  }
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

const markUp = () => {
  if (state.previousNumber === null) return;

  const percentage = Number(state.currentNumber);

  const result =
    state.previousNumber +
    (state.previousNumber * percentage) / 100;

  state.currentNumber = formatNumber(result);

  // Masukkan MU ke history
  state.history.push(
    `${state.previousNumber} + ${percentage}% = ${state.currentNumber}`
  );

  // Simpan history
  saveHistory();

  state.grandTotal += Number(state.currentNumber);
  state.previousNumber = null;
  state.currentOperator = null;

  updateDisplay();
};

// Pindah ke halaman history
const showHistory = () => {
  window.location.href = "history.html";
};


// =========================
// NUMBER BUTTON
// =========================

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();

    value === "."
      ? inputDecimal()
      : inputNumber(value);
  });
});


// =========================
// OPERATOR BUTTON
// =========================

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();

    if (value === "%") {
      calculatePercent();
    } else if (value === "MU") {
      markUp();
    } else {
      chooseOperator(value);
    }
  });
});


// =========================
// PLUS & EQUAL
// =========================

plusButton.addEventListener(
  "click",
  () => chooseOperator("+")
);

equalButton.addEventListener(
  "click",
  calculate
);


// =========================
// MEMORY BUTTON
// =========================

memoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();

    switch (value) {
      case "M+":
        memoryPlus();
        break;

      case "M-":
        memoryMinus();
        break;

      case "MRC":
        memoryRecall();
        break;

      case "GT":
        grandTotalFunction();
        break;

      case "AC":
        clearCalculator();
        break;
    }
  });
});


// =========================
// HISTORY BUTTON
// =========================

historyButton.addEventListener(
  "click",
  showHistory
);


// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    inputNumber(key);
  }

  else if (key === ".") {
    inputDecimal();
  }

  else if (key === "+") {
    chooseOperator("+");
  }

  else if (key === "-") {
    chooseOperator("-");
  }

  else if (key === "*") {
    chooseOperator("×");
  }

  else if (key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  }

  else if (key === "Enter" || key === "=") {
    calculate();
  }

  else if (key === "Escape") {
    clearCalculator();
  }

  else if (key === "Backspace") {
    state.currentNumber =
      state.currentNumber.length > 1 &&
      state.currentNumber !== "Error"
        ? state.currentNumber.slice(0, -1)
        : "0";

    updateDisplay();
  }

  else if (key === "%") {
    calculatePercent();
  }
});