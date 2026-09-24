const historyList = document.querySelector("#historyList");
const historyEmpty = document.querySelector("#historyEmpty");

// Ambil history dari localStorage
const history = JSON.parse(
  localStorage.getItem("calculatorHistory") || "[]"
);

// Kalau history masih kosong
if (history.length === 0) {
  historyEmpty.style.display = "block";
} else {
  historyEmpty.style.display = "none";

  // History terbaru ditampilkan paling atas
  history
    .slice()
    .reverse()
    .forEach((item) => {
      const historyItem = document.createElement("div");
      historyItem.classList.add("history-item");

      // Pisahkan operasi dan hasil
      const equalIndex = item.lastIndexOf(" = ");

      if (equalIndex !== -1) {
        const expression = document.createElement("span");
        expression.classList.add("history-expression");
        expression.textContent = item.slice(0, equalIndex);

        const equalSign = document.createElement("span");
        equalSign.classList.add("history-equal");
        equalSign.textContent = "=";

        const result = document.createElement("span");
        result.classList.add("history-result");
        result.textContent = item.slice(equalIndex + 3);

        historyItem.append(
          expression,
          equalSign,
          result
        );
      } else {
        historyItem.textContent = item;
      }

      historyList.appendChild(historyItem);
    });
}