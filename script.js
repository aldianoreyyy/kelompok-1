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
  history: []
};

// =========================
// DISPLAY
// =========================

const updateDisplay = () => {
  display.textContent = state.currentNumber;
};

const formatNumber = (number) =>
  Number.isFinite(number)
    ? Number(number.toFixed(10)).toString()
    : "Error";


// =========================
// INPUT ANGKA
// =========================

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


// =========================
// INPUT DESIMAL
// =========================

const inputDecimal = () => {
  if (state.currentNumber === "Error") {
    state.currentNumber = "0";
  }

  if (state.currentNumber.includes(".")) return;

  state.currentNumber += ".";
  updateDisplay();
};


// =========================
// OPERATOR
// =========================

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


// =========================
// PERHITUNGAN
// =========================

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

  // Cegah pembagian dengan 0
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

  // Simpan history
  state.history.push(
    `${previous} ${operator} ${current} = ${result}`
  );

  // Tambah ke Grand Total
  state.grandTotal += Number(result);

  state.currentNumber = result;
  state.previousNumber = null;
  state.currentOperator = null;

  updateDisplay();
};


// =========================
// PERCENT
// =========================

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


// =========================
// CLEAR / AC
// =========================

const clearCalculator = () => {
  state.currentNumber = "0";
  state.previousNumber = null;
  state.currentOperator = null;

  updateDisplay();
};


// =========================
// MEMORY +
// =========================

const memoryPlus = () => {
  const number = Number(state.currentNumber);

  if (Number.isFinite(number)) {
    state.memory += number;
  }
};


// =========================
// MEMORY -
// =========================

const memoryMinus = () => {
  const number = Number(state.currentNumber);

  if (Number.isFinite(number)) {
    state.memory -= number;
  }
};


// =========================
// MEMORY RECALL
// =========================

const memoryRecall = () => {
  if (state.memory !== 0) {
    state.currentNumber = formatNumber(state.memory);
  } else {
    state.memory = 0;
  }

  updateDisplay();
};


// =========================
// GRAND TOTAL
// =========================

const grandTotalFunction = () => {
  state.currentNumber = formatNumber(state.grandTotal);

  updateDisplay();
};


// =========================
// MARK UP
// =========================

const markUp = () => {
  if (state.previousNumber === null) return;

  const percentage = Number(state.currentNumber);

  const result =
    state.previousNumber +
    (state.previousNumber * percentage) / 100;

  state.currentNumber = formatNumber(result);

  state.history.push(
    `${state.previousNumber} + ${percentage}% = ${state.currentNumber}`
  );

  state.grandTotal += Number(state.currentNumber);

  state.previousNumber = null;
  state.currentOperator = null;

  updateDisplay();
};


// =========================
// HISTORY
// =========================

const showHistory = () => {
  if (state.history.length === 0) {
    alert("Belum ada riwayat perhitungan.");
    return;
  }

  const historyText = state.history
    .slice(-10)
    .reverse()
    .join("\n");

  alert(
    "RIWAYAT PERHITUNGAN\n\n" +
    historyText
  );
};


// =========================
// TOMBOL ANGKA
// =========================

numberButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const value = button.textContent.trim();

    if (value === ".") {
      inputDecimal();
    } else {
      inputNumber(value);
    }

  });

});


// =========================
// TOMBOL OPERATOR
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
// TOMBOL PLUS
// =========================

plusButton.addEventListener("click", () => {

  chooseOperator("+");

});


// =========================
// BUG 1 - TOMBOL =
// =========================

// BUG SENGAJA:
// Tombol "=" tidak menjalankan calculate()

equalButton.addEventListener("click", () => {

  // calculate();

});


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


      // =========================
      // BUG 2 - TOMBOL AC
      // =========================

      // BUG SENGAJA:
      // AC tidak menjalankan clearCalculator()

      case "AC":

        break;

    }

  });

});


// =========================
// HISTORY BUTTON
// =========================

historyButton.addEventListener("click", () => {

  showHistory();

});


// =========================
// KEYBOARD
// =========================

document.addEventListener("keydown", (event) => {

  const key = event.key;


  // ANGKA

  if (/^[0-9]$/.test(key)) {

    inputNumber(key);

  }


  // DESIMAL

  else if (key === ".") {

    inputDecimal();

  }


  // PLUS

  else if (key === "+") {

    chooseOperator("+");

  }


  // MINUS

  else if (key === "-") {

    chooseOperator("-");

  }


  // KALI

  else if (key === "*") {

    chooseOperator("×");

  }


  // BAGI

  else if (key === "/") {

    event.preventDefault();

    chooseOperator("÷");

  }


  // ENTER / = KEYBOARD
  // Keyboard masih bisa menghitung

  else if (
    key === "Enter" ||
    key === "="
  ) {

    calculate();

  }


  // ESCAPE

  else if (key === "Escape") {

    clearCalculator();

  }


  // BACKSPACE

  else if (key === "Backspace") {

    state.currentNumber =
      state.currentNumber.length > 1 &&
      state.currentNumber !== "Error"
        ? state.currentNumber.slice(0, -1)
        : "0";

    updateDisplay();

  }


  // PERCENT

  else if (key === "%") {

    calculatePercent();

  }

});