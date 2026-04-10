var places = {
  entrance: { name: "Main Entrance", icon: "🏫" },
  library: { name: "Library", icon: "📚" },
  kings: { name: "King's Lounge", icon: "🛋" },
  registrar: { name: "Registrar Office", icon: "📄" },
  indigenous: { name: "Indigenous Center", icon: "🌿" },
  theater: { name: "Theater", icon: "🎭" },
  it: { name: "IT Department", icon: "💻" }
};

var edges = [
  { from: "entrance", to: "kings", dir: "straight", photo: "images/hallway_north.jpg", text: "Walk straight from the entrance lobby into the north corridor." },
  { from: "kings", to: "library", dir: "right", photo: "images/corridor_lib.jpg", text: "Turn right from King's Lounge and continue to the Library wing." },
  { from: "library", to: "registrar", dir: "right", photo: "images/corridor_reg.jpg", text: "Take the right-side office corridor to reach Registrar Office." },
  { from: "kings", to: "indigenous", dir: "left", photo: "images/hall_center.jpg", text: "From King's Lounge, turn left and move toward the cultural center." },
  { from: "indigenous", to: "theater", dir: "straight", photo: "images/theater_area.jpg", text: "Continue straight from Indigenous Center to Theater side." },
  { from: "registrar", to: "it", dir: "right", photo: "images/corridor_it.jpg", text: "From Registrar Office, turn right and follow the east wing to IT." },
  { from: "entrance", to: "library", dir: "right", photo: "images/junction.jpg", text: "Go straight then turn right at the junction to Library." },
  { from: "entrance", to: "theater", dir: "left", photo: "images/walkway.jpg", text: "From entrance, take left corridor toward the theater block." },
  { from: "entrance", to: "registrar", dir: "right", photo: "images/corridor_east.jpg", text: "Move straight and turn right to office corridors." },
  { from: "entrance", to: "it", dir: "right", photo: "images/passage_b.jpg", text: "Take the right junction and follow east passage to IT." }
];

var byFrom = {};
edges.forEach(function(edge) {
  if (!byFrom[edge.from]) byFrom[edge.from] = [];
  if (!byFrom[edge.to]) byFrom[edge.to] = [];
  byFrom[edge.from].push(edge);
  byFrom[edge.to].push({
    from: edge.to,
    to: edge.from,
    dir: reverseDir(edge.dir),
    photo: edge.photo,
    text: edge.text
  });
});

var fromSelect = document.getElementById("fromSelect");
var toSelect = document.getElementById("toSelect");
var buildBtn = document.getElementById("buildBtn");
var swapBtn = document.getElementById("swapBtn");
var routeSummary = document.getElementById("routeSummary");
var stage = document.getElementById("stage");
var timeline = document.getElementById("timeline");
var feedback = document.getElementById("feedback");

var stepTitle = document.getElementById("stepTitle");
var stepCounter = document.getElementById("stepCounter");
var stepPhoto = document.getElementById("stepPhoto");
var arrowSvg = document.getElementById("arrowSvg");
var arrowText = document.getElementById("arrowText");
var stepDesc = document.getElementById("stepDesc");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");

var currentSteps = [];
var currentStepIndex = 0;

populateSelects();

swapBtn.addEventListener("click", function() {
  var temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
});

buildBtn.addEventListener("click", function() {
  feedback.textContent = "";
  var start = fromSelect.value;
  var end = toSelect.value;

  if (!start || !end) {
    feedback.textContent = "Select both start and destination.";
    return;
  }
  if (start === end) {
    feedback.textContent = "Start and destination are same.";
    return;
  }

  var pathEdges = findShortestRoute(start, end);
  if (!pathEdges.length) {
    feedback.textContent = "No route found for this combination.";
    return;
  }

  currentSteps = pathEdges.map(function(edge, i) {
    return {
      title: "Step " + (i + 1) + " - " + directionLabel(edge.dir),
      desc: edge.text,
      photo: edge.photo,
      dir: edge.dir
    };
  });

  currentSteps.push({
    title: "Arrived",
    desc: "You reached " + places[end].name + ".",
    photo: getArrivalPhoto(end),
    dir: "arrive"
  });

  currentStepIndex = 0;
  routeSummary.classList.remove("hidden");
  stage.classList.remove("hidden");
  timeline.classList.remove("hidden");
  routeSummary.textContent = places[start].icon + " " + places[start].name + " → " + places[end].icon + " " + places[end].name + "  |  " + currentSteps.length + " steps";
  renderStep();
  renderTimeline();
});

prevBtn.addEventListener("click", function() {
  if (currentStepIndex > 0) {
    currentStepIndex -= 1;
    renderStep();
    renderTimeline();
  }
});

nextBtn.addEventListener("click", function() {
  if (currentStepIndex < currentSteps.length - 1) {
    currentStepIndex += 1;
    renderStep();
    renderTimeline();
  }
});

function populateSelects() {
  var keys = Object.keys(places);
  fromSelect.innerHTML = '<option value="">Select start</option>';
  toSelect.innerHTML = '<option value="">Select destination</option>';
  keys.forEach(function(key) {
    var option1 = document.createElement("option");
    option1.value = key;
    option1.textContent = places[key].icon + " " + places[key].name;
    fromSelect.appendChild(option1);

    var option2 = document.createElement("option");
    option2.value = key;
    option2.textContent = places[key].icon + " " + places[key].name;
    toSelect.appendChild(option2);
  });
}

function findShortestRoute(start, end) {
  var queue = [{ node: start, path: [] }];
  var visited = {};
  visited[start] = true;

  while (queue.length) {
    var current = queue.shift();
    if (current.node === end) return current.path;

    var neighbors = byFrom[current.node] || [];
    neighbors.forEach(function(edge) {
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        queue.push({
          node: edge.to,
          path: current.path.concat(edge)
        });
      }
    });
  }

  return [];
}

function renderStep() {
  var step = currentSteps[currentStepIndex];
  stepTitle.textContent = step.title;
  stepCounter.textContent = "Step " + (currentStepIndex + 1) + " / " + currentSteps.length;
  stepPhoto.src = step.photo;
  stepDesc.textContent = step.desc;
  arrowText.textContent = directionLabel(step.dir);
  drawArrow(step.dir);
  prevBtn.disabled = currentStepIndex === 0;
  nextBtn.disabled = currentStepIndex === currentSteps.length - 1;
}

function renderTimeline() {
  timeline.innerHTML = "";
  currentSteps.forEach(function(step, index) {
    var card = document.createElement("article");
    card.className = "timeline-card" + (index === currentStepIndex ? " active" : "");
    card.innerHTML = '<img src="' + step.photo + '" alt="' + step.title + '"><p>' + (index + 1) + ". " + directionLabel(step.dir) + "</p>";
    card.addEventListener("click", function() {
      currentStepIndex = index;
      renderStep();
      renderTimeline();
    });
    timeline.appendChild(card);
  });
}

function drawArrow(dir) {
  var color = dir === "arrive" ? "#22c55e" : "#ffdf4d";
  var path = "";

  if (dir === "left") {
    path = '<g transform="translate(60 60) rotate(-90) translate(-60 -60)"><path d="M60 12L60 94"/><path d="M35 40L60 12L85 40"/></g>';
  } else if (dir === "right") {
    path = '<g transform="translate(60 60) rotate(90) translate(-60 -60)"><path d="M60 12L60 94"/><path d="M35 40L60 12L85 40"/></g>';
  } else if (dir === "arrive") {
    path = '<circle cx="60" cy="60" r="34"/><path d="M43 60l11 11 24-24"/>';
  } else {
    path = '<path d="M60 12L60 94"/><path d="M35 40L60 12L85 40"/>';
  }

  arrowSvg.innerHTML = '<g stroke="' + color + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none">' + path + '</g>';
}

function directionLabel(dir) {
  if (dir === "left") return "Turn Left";
  if (dir === "right") return "Turn Right";
  if (dir === "arrive") return "Arrived";
  return "Go Straight";
}

function reverseDir(dir) {
  if (dir === "left") return "right";
  if (dir === "right") return "left";
  return dir;
}

function getArrivalPhoto(place) {
  if (place === "library") return "images/corridor_lib.jpg";
  if (place === "kings") return "images/corridor_kings.jpg";
  if (place === "registrar") return "images/corridor_reg.jpg";
  if (place === "indigenous") return "images/hall_center.jpg";
  if (place === "theater") return "images/theater_area.jpg";
  if (place === "it") return "images/corridor_it.jpg";
  return "images/entrance.jpg";
}