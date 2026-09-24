const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");

// Ambil data dari localStorage
const historyData =
  JSON.parse(localStorage.getItem("calculatorHistory")) || [];

console.log("History:", historyData);

// Kalau belum ada history
if (historyData.length === 0) {
  historyEmpty.style.display = "block";
} else {
  // Hilangkan tulisan kosong
  historyEmpty.style.display = "none";

  // Tampilkan history terbaru paling atas
  historyData
    .slice()
    .reverse()
    .forEach((item) => {
      const historyItem = document.createElement("div");

      historyItem.classList.add("history-item");
      historyItem.textContent = item;

      historyList.appendChild(historyItem);
    });
}