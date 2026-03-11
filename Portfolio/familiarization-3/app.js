const button = document.getElementById("myButton");
const messageBox = document.getElementById("messageBox");
const clickCount = document.getElementById("clickCount");

let count = 0;

button.addEventListener("click", function () {
  count++;
  clickCount.textContent = count;

  button.classList.toggle("active");
  messageBox.classList.toggle("show");

  // ALERT ADDITION
  alert("Button was clicked!");

  // CUSTOM ADDITION: change background after 5 clicks
  if (count >= 5) {
    document.body.style.backgroundColor = "#fef6e4";
  }

  if (messageBox.classList.contains("show")) {
    button.textContent = "Hide Message";
  } else {
    button.textContent = "Click Me!";
  }
});

console.log("JavaScript is connected and ready!");
