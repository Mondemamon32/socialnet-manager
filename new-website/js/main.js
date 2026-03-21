AOS.init();

// DARK MODE
function toggleTheme(){
let html=document.documentElement;
html.dataset.bsTheme=html.dataset.bsTheme==="dark"?"light":"dark";
}

// CLOCK
function getGreeting(){
let h=new Date().getHours();
if(h<12)return"Good Morning!";
if(h<17)return"Good Afternoon!";
if(h<20)return"Good Evening!";
return"Good Night!";
}

function updateClock(){
document.getElementById("clock").innerText=new Date().toLocaleTimeString();
}

function initClock(){
document.getElementById("greeting").innerText=getGreeting();
updateClock();
setInterval(updateClock,1000);
}

// BALL
let ball, x = 200, y = 200;
let vx = 0, vy = 0;
let gravity = 0.6;
let bounce = 0.8;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

function openBall() {
  document.getElementById("ballModal").style.display = "block";
  ball = document.getElementById("ball");

  // MOUSE DOWN (grab)
  ball.onmousedown = function(e) {
    isDragging = true;
    offsetX = e.clientX - x;
    offsetY = e.clientY - y;
    ball.style.cursor = "grabbing";
  };

  // MOUSE MOVE (drag)
  document.onmousemove = function(e) {
    if (isDragging) {
      x = e.clientX - offsetX;
      y = e.clientY - offsetY;
      vx = 0;
      vy = 0;
    }
  };

  // MOUSE UP (release)
  document.onmouseup = function() {
    isDragging = false;
    ball.style.cursor = "grab";
  };

  animate();
}

function closeBall() {
  document.getElementById("ballModal").style.display = "none";
}

function animate() {
  if (!isDragging) {
    vy += gravity;
    x += vx;
    y += vy;

    if (y + 60 > window.innerHeight) {
      y = window.innerHeight - 60;
      vy = -vy * bounce;
    }

    if (x < 0) x = 0;
    if (x + 60 > window.innerWidth) x = window.innerWidth - 60;
  }

  ball.style.left = x + "px";
  ball.style.top = y + "px";

  requestAnimationFrame(animate);
  
}
document.addEventListener("DOMContentLoaded", function () {
  initClock();
});