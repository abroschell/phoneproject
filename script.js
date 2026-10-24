// ============================================
// NAVIGATION 
// ============================================
function setScreen(id) {
  document.querySelectorAll(".page").forEach(function (page) {
    page.classList.toggle("active", page.id === id);
  });
  if (id === "weatherScreen") {
    loadWeather();
  }
}

document.getElementById("unlockButton").addEventListener("click", function () {
  setScreen("homeScreen");
});

// any element with data-open="screenId" navigates there
document.querySelectorAll("[data-open]").forEach(function (el) {
  el.addEventListener("click", function () {
    setScreen(el.dataset.open);
  });
});


// ============================================
// CLOCK (lock screen + status bar)
// ============================================
function updateClock() {
  var now = new Date();
  var time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\s?(AM|PM)/i, "");
  var date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .replace(",", "");
  document.getElementById("lockTime").textContent = time;
  document.getElementById("statusTime").textContent = time;
  document.getElementById("lockDate").textContent = date;
}
updateClock();
setInterval(updateClock, 1000);


// ============================================
// TO DO LIS
// ============================================
var tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch (e) {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  var list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(function (task, index) {
    var li = document.createElement("li");
    li.textContent = task.text; // textContent (not innerHTML) keeps user input safe
    if (task.done) li.classList.add("done");
    li.addEventListener("click", function () {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });
    list.appendChild(li);
  });
}

function addTask() {
  var input = document.getElementById("taskInput");
  var text = input.value.trim();
  if (text !== "") {
    tasks.push({ text: text, done: false });
    saveTasks();
    renderTasks();
    input.value = "";
  }
}

document.getElementById("addTask").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});
document.getElementById("clearTasks").addEventListener("click", function () {
  tasks = [];
  saveTasks();
  renderTasks();
});
renderTasks();


// CALCULATOR
var expr = "";
var display = document.getElementById("calcDisplay");

function evaluate() {
  try {
    var result = Function("return " + expr)();
    if (!isFinite(result)) return "Error";
    return String(parseFloat(result.toFixed(8)));
  } catch (e) {
    return "Error";
  }
}

document.querySelectorAll(".key").forEach(function (key) {
  key.addEventListener("click", function () {
    var k = key.dataset.key;
    if (expr === "Error") expr = "";

    if (k === "C") {
      expr = "";
    } else if (k === "<") {
      expr = expr.slice(0, -1);
    } else if (k === "=") {
      if (expr !== "") expr = evaluate();
    } else if (k === "%") {
      if (expr !== "") expr = String(parseFloat(evaluate()) / 100);
    } else if (k === "neg") {
      if (expr !== "") expr = String(parseFloat(evaluate()) * -1);
    } else {
      expr += k;
    }

    display.textContent = expr === "" ? "0" : expr;
  });
});

// ============================================
// WEATHER (preset data, no location or API needed)
// Edit the numbers below to change what shows on screen.
// ============================================

var icons = {
  moon: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#ffd23f"/><path stroke="#ffd23f" stroke-width="1.6" stroke-linecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M7 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5 4.8 4.8 0 0 1 17.5 19z"/></svg>',
  rain: '<svg viewBox="0 0 24 24"><path fill="#9cc3ea" d="M7 19a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5 4.8 4.8 0 0 1 17.5 19z"/></svg>'
};

// bar colors: [left color, right color]
var green = "#6fd04f", lime = "#c4f55a", yellow = "#ffd23f",
    red = "#f0524d", cyan = "#14c0e8", blue = "#2f7fd0";

var cities = [
  {
    label: "MY LOCATION",
    name: "Toronto",
    temp: 10,
    cond: "Clear Skies",
    hi: 14,
    lo: 3,
    summary: "Clear skies will continue for the rest of the night. Wind gusts up to 10 km/h.",
    hours: [["Now", 10], ["10PM", 8], ["11PM", 7], ["12AM", 5], ["1AM", 4], ["2AM", 3]],
    days: [
      ["Today", "moon", 3, 14, cyan, green],
      ["Sat", "sun", 5, 21, lime, yellow],
      ["Sun", "sun", 2, 18, green, lime],
      ["Mon", "cloud", 0, 10, blue, cyan],
      ["Tues", "sun", 4, 15, cyan, green],
      ["Wed", "rain", 5, 16, cyan, green]
    ]
  },
  {
    label: "",
    name: "Miami",
    temp: 21,
    cond: "Clear Skies",
    hi: 24,
    lo: 17,
    summary: "Clear skies will continue for the rest of the night. Wind gusts up to 10 km/h.",
    hours: [["Now", 21], ["10PM", 21], ["11PM", 20], ["12AM", 19], ["1AM", 19], ["2AM", 18]],
    days: [
      ["Today", "moon", 17, 24, green, lime],
      ["Sat", "sun", 16, 23, lime, yellow],
      ["Sun", "sun", 18, 26, green, lime],
      ["Mon", "cloud", 20, 27, yellow, red],
      ["Tues", "sun", 17, 23, green, lime],
      ["Wed", "rain", 19, 27, yellow, red]
    ]
  }
];

var cityIndex = 0;

function renderWeather() {
  var c = cities[cityIndex];

  // the bars are scaled against the coldest and warmest day this week
  var weekMin = Math.min.apply(null, c.days.map(function (d) { return d[2]; }));
  var weekMax = Math.max.apply(null, c.days.map(function (d) { return d[3]; }));
  var span = weekMax - weekMin;

  var hoursHtml = c.hours.map(function (h) {
    return '<div class="w-hour"><span>' + h[0] + '</span>' + icons.moon + '<span>' + h[1] + '°</span></div>';
  }).join("");

  var daysHtml = c.days.map(function (d, i) {
    var left = ((d[2] - weekMin) / span) * 100;
    var width = ((d[3] - d[2]) / span) * 100;
    // today's dot shows the current temperature
    var dot = "";
    if (i === 0) {
      var pos = ((c.temp - d[2]) / (d[3] - d[2])) * 100;
      dot = '<span class="w-dot" style="left:' + pos + '%"></span>';
    }
    return '<div class="w-row">' +
      '<span class="w-day">' + d[0] + '</span>' +
      icons[d[1]] +
      '<span class="lo">' + d[2] + '°</span>' +
      '<div class="w-track"><div class="w-bar" style="left:' + left + '%;width:' + width +
      '%;background:linear-gradient(to right,' + d[4] + ',' + d[5] + ')">' + dot + '</div></div>' +
      '<span class="hi">' + d[3] + '°</span></div>';
  }).join("");

  var dotsHtml = cities.map(function (city, i) {
    return '<button class="' + (i === cityIndex ? "on" : "") + '" data-city="' + i +
      '" aria-label="Show ' + city.name + '"></button>';
  }).join("");

  document.querySelectorAll(".w-dots button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      cityIndex = Number(btn.dataset.city);
      renderWeather();
    });
  });
}

renderWeather();
