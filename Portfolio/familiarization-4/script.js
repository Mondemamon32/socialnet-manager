const grid = document.getElementById("grid");
for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
}
grid.addEventListener("click", function (event) {
    if (event.target.classList.contains("cell")) {
        event.target.classList.toggle("active");
}
});
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
const cells = document.querySelectorAll(".cell");
cells.forEach(function (cell) {
cell.classList.remove("active");
cell.style.backgroundColor = "";
});
});
const rainbowBtn = document.getElementById("rainbowBtn");
rainbowBtn.addEventListener("click", function () {
const cells = document.querySelectorAll(".cell");
cells.forEach(function (cell) {
const r = Math.floor(Math.random() * 256);
const g = Math.floor(Math.random() * 256);
const b = Math.floor(Math.random() * 256);
cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
cell.classList.remove("active");
});
});