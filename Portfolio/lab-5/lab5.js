// 1. Sum of Array
let numbers = [10, 20, 30, 40, 50, 60];
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i];
}
document.getElementById("sumResult").innerHTML =
  "Array elements: " + numbers.join(", ") +
  "<br>Sum of array elements: " + sum;


// 2. Leap Year
function leapYear(year) {
  let result =
    ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    ? "Leap Year" : "Not a Leap Year";

  alert("Input Year: " + year + "\nResult: " + result);
}

function checkLeap() {
  let year = prompt("Enter a year:");
  leapYear(year);
}


// 3. Odd or Even (0–15)
let text = "";
for (let i = 0; i <= 15; i++) {
  text += "Number: " + i + " → " +
          (i % 2 === 0 ? "Even" : "Odd") + "<br>";
}
document.getElementById("oddEven").innerHTML = text;


// 4. Multiply & Divide
function multiplyBy() {
  let n1 = document.getElementById("num1").value;
  let n2 = document.getElementById("num2").value;
  let result = n1 * n2;

  document.getElementById("result").innerHTML =
    "Input 1: " + n1 + "<br>" +
    "Input 2: " + n2 + "<br>" +
    "Multiplication Result: " + result;
}

function divideBy() {
  let n1 = document.getElementById("num1").value;
  let n2 = document.getElementById("num2").value;
  let result = n1 / n2;

  document.getElementById("result").innerHTML =
    "Input 1: " + n1 + "<br>" +
    "Input 2: " + n2 + "<br>" +
    "Division Result: " + result;
}


// 5. Temperature Conversion
function CentoFar() {
  let c = document.getElementById("cen").value;
  let f = (c * 9/5) + 32;

  document.getElementById("tempResult").innerHTML =
    "Input Celsius: " + c + "<br>" +
    "Converted Fahrenheit: " + f;
}

function FartoCen() {
  let f = document.getElementById("far").value;
  let c = (f - 32) * 5/9;

  document.getElementById("tempResult").innerHTML =
    "Input Fahrenheit: " + f + "<br>" +
    "Converted Celsius: " + c;
}


// 6. Reverse Number
function reverseNumber() {
  let original = prompt("Enter a number:");
  let num = original;
  let rev = 0;

  while (num > 0) {
    rev = rev * 10 + (num % 10);
    num = Math.floor(num / 10);
  }

  document.getElementById("revResult").innerHTML =
    "Input Number: " + original + "<br>" +
    "Reversed Number: " + rev;
}


// 7. Palindrome Check
function palindromeCheck() {
  let str = prompt("Enter a string:");
  let rev = str.split("").reverse().join("");

  document.getElementById("palResult").innerHTML =
    "Input String: " + str + "<br>" +
    "Result: " + (str === rev ? "Palindrome" : "Not a Palindrome");
}


// 8. Uppercase Check
function upperCaseCheck() {
  let str = prompt("Enter a string:");

  document.getElementById("upperResult").innerHTML =
    "Input String: " + str + "<br>" +
    "Result: " +
    (str.charAt(0) === str.charAt(0).toUpperCase()
      ? "First character is Uppercase"
      : "First character is NOT Uppercase");
}


// 9. Background Color
function set_background() {
  document.getElementById("para").style.backgroundColor = "yellow";
}


// 10. Mobile Number Validation
function MobileNoValidation() {
  let mobile = document.getElementById("mobile").value;
  let pattern = /^09[0-9]{9}$/;

  document.getElementById("msg").innerHTML =
    "Input Mobile Number: " + mobile + "<br>" +
    "Result: " +
    (pattern.test(mobile)
      ? "Valid Mobile Number"
      : "Invalid Mobile Number");
}
