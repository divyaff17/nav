/*
 * App Logic for Campus Navigator
 * Divya
 */

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
  { from: "kings", to: "wp_start", dir: "straight", photo: "images/hall_center.jpg", text: "Exit King's Lounge into the center hall." },
  { from: "wp_start", to: "entrance", dir: "straight", photo: "images/hallway_north.jpg", text: "Walk down the corridor to the Main Entrance." },
  { from: "wp_start", to: "wp_k1", dir: "right", photo: "images/lobby.jpg", text: "Walk toward the main lobby." },
  { from: "wp_k1", to: "wp_k2", dir: "right", photo: "images/corridor_west.jpg", text: "Take the West corridor." },
  { from: "wp_k2", to: "library", dir: "left", photo: "images/walkway.jpg", text: "Follow the walkway into the Library wing." },
  { from: "wp_start", to: "wp_i2", dir: "left", photo: "images/hall_turn.jpg", text: "Continue straight past the turn." },
  { from: "wp_i2", to: "indigenous", dir: "right", photo: "images/entrance.jpg", text: "Turn right toward the Indigenous Center." },
  { from: "indigenous", to: "wp_t1", dir: "left", photo: "images/hallway_south.jpg", text: "Take the south hallway." },
  { from: "wp_t1", to: "wp_t2", dir: "straight", photo: "images/hall_theater.jpg", text: "Move through the theater hall." },
  { from: "wp_t2", to: "theater", dir: "straight", photo: "images/passage_a.jpg", text: "Proceed down Passage A to the Theater." },
  { from: "library", to: "wp_r1", dir: "right", photo: "images/junction.jpg", text: "Turn right at the main junction." },
  { from: "wp_r1", to: "registrar", dir: "left", photo: "images/corridor_east.jpg", text: "Enter the East corridor toward Registrar." },
  { from: "registrar", to: "wp_it1", dir: "straight", photo: "images/passage_b.jpg", text: "Walk down Passage B." },
  { from: "wp_it1", to: "wp_it2", dir: "right", photo: "images/passage_c.jpg", text: "Turn right into Passage C." },
  { from: "wp_it2", to: "it", dir: "straight", photo: "images/hallway_north.jpg", text: "Follow the North hallway to IT." }
];

var byFrom = {};
for (var i = 0; i < edges.length; i++) {
  var edge = edges[i];
  if (!byFrom[edge.from]) {
    byFrom[edge.from] = [];
  }
  if (!byFrom[edge.to]) {
    byFrom[edge.to] = [];
  }
  
  byFrom[edge.from].push(edge);
  
  byFrom[edge.to].push({
    from: edge.to,
    to: edge.from,
    dir: reverseDir(edge.dir),
    photo: edge.photo,
    text: edge.text
  });
}

var toSelect = document.getElementById("toSelect");
var buildBtn = document.getElementById("buildBtn");
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

var photoFrame = document.getElementById("photoFrame");
var imageLoader = document.getElementById("imageLoader");

var currentSteps = [];
var currentStepIndex = 0;

populateSelects();

buildBtn.addEventListener("click", function() {
  feedback.textContent = "";
  var start = "kings";
  var end = toSelect.value;

  if (!end) {
    feedback.textContent = "Select a destination.";
    return;
  }
  
  if (start === end) {
    feedback.textContent = "Start and destination cannot be the same.";
    return;
  }

  var pathEdges = findShortestRoute(start, end);
  if (pathEdges.length === 0) {
    feedback.textContent = "No route found for this combination.";
    return;
  }

  currentSteps = [];
  for (var j = 0; j < pathEdges.length; j++) {
    var e = pathEdges[j];
    var stepNum = j + 1;
    currentSteps.push({
      title: "Step " + stepNum + " - " + directionLabel(e.dir),
      desc: e.text,
      photo: e.photo,
      dir: e.dir
    });
  }

  currentSteps.push({
    title: "Arrived",
    desc: "You have successfully reached the " + places[end].name + ".",
    photo: getArrivalPhoto(end),
    dir: "arrive"
  });

  currentStepIndex = 0;
  
  routeSummary.style.display = "block";
  stage.style.display = "block";
  timeline.style.display = "block";
  
  routeSummary.innerHTML = "<span>" + places[start].icon + " " + places[start].name + "</span>" +
    " <span style='opacity:0.5; margin:0 10px;'>&rarr;</span> " +
    "<span>" + places[end].icon + " " + places[end].name + "</span>" +
    "<span style='opacity:0.5; margin-left:10px;'>|</span>" +
    "<span style='margin-left:10px;'>" + currentSteps.length + " steps</span>";
  
  renderStep();
  renderTimeline();
});

prevBtn.addEventListener("click", function() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
    renderTimeline();
  }
});

nextBtn.addEventListener("click", function() {
  if (currentStepIndex < currentSteps.length - 1) {
    currentStepIndex++;
    renderStep();
    renderTimeline();
  }
});

function renderStep() {
  var step = currentSteps[currentStepIndex];
  
  photoFrame.className = "out";
  stepDesc.className = "out";
  
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  setTimeout(function() {
    stepTitle.textContent = step.title;
    var currentNum = currentStepIndex + 1;
    stepCounter.textContent = "Step " + currentNum + " of " + currentSteps.length;
    stepDesc.textContent = step.desc;
    arrowText.textContent = directionLabel(step.dir);
    drawArrow(step.dir);
    
    imageLoader.className = "in";
    
    var img = new Image();
    img.onload = function() {
      stepPhoto.src = step.photo;
      imageLoader.className = "out";
      photoFrame.className = "in";
      stepDesc.className = "in";
      
      prevBtn.disabled = (currentStepIndex === 0);
      nextBtn.disabled = (currentStepIndex === currentSteps.length - 1);
    };
    
    img.onerror = function() {
      stepPhoto.src = step.photo;
      imageLoader.className = "out";
      photoFrame.className = "in";
      stepDesc.className = "in";
      
      prevBtn.disabled = (currentStepIndex === 0);
      nextBtn.disabled = (currentStepIndex === currentSteps.length - 1);
    };
    
    img.src = step.photo;
  }, 300);
}

function renderTimeline() {
  timeline.innerHTML = "";
  
  for (var k = 0; k < currentSteps.length; k++) {
    (function(index) {
      var step = currentSteps[index];
      var card = document.createElement("div");
      
      var className = "timeline-card";
      if (index === currentStepIndex) {
        className += " active";
      }
      card.className = className;
      
      var stepNumber = index + 1;
      card.innerHTML = "<img src='" + step.photo + "' alt='" + step.title + "'>" +
        "<p>" + stepNumber + ". " + directionLabel(step.dir) + "</p>";
      
      card.addEventListener("click", function() {
        if (currentStepIndex !== index) {
          currentStepIndex = index;
          renderStep();
          renderTimeline();
        }
      });
      
      timeline.appendChild(card);
    })(k);
  }
}

function populateSelects() {
  toSelect.innerHTML = "<option value='' disabled selected>Select Destination...</option>";
  
  for (var key in places) {
    if (places.hasOwnProperty(key)) {
      if (key === "kings") {
        continue;
      }
      var place = places[key];
      var optionText = place.icon + " " + place.name;
      toSelect.appendChild(new Option(optionText, key));
    }
  }
}

function findShortestRoute(start, end) {
  var queue = [{ node: start, path: [] }];
  var visited = {};
  visited[start] = true;

  while (queue.length > 0) {
    var current = queue.shift();
    if (current.node === end) {
      return current.path;
    }

    var neighbors = byFrom[current.node];
    if (!neighbors) {
      neighbors = [];
    }
    
    for (var m = 0; m < neighbors.length; m++) {
      var edge = neighbors[m];
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        
        var newPath = [];
        for (var n = 0; n < current.path.length; n++) {
          newPath.push(current.path[n]);
        }
        newPath.push(edge);
        
        queue.push({
          node: edge.to,
          path: newPath
        });
      }
    }
  }
  return [];
}

function drawArrow(dir) {
  var color = "#60a5fa";
  if (dir === "arrive") {
    color = "#34d399";
  }
  
  var path = "";

  if (dir === "left") {
    path = '<g transform="translate(60 60) rotate(-90) translate(-60 -60)"><path d="M60 20L60 100"/><path d="M35 45L60 20L85 45"/></g>';
  } else if (dir === "right") {
    path = '<g transform="translate(60 60) rotate(90) translate(-60 -60)"><path d="M60 20L60 100"/><path d="M35 45L60 20L85 45"/></g>';
  } else if (dir === "arrive") {
    path = '<circle cx="60" cy="60" r="36"/><path d="M42 60l12 12 24-24"/>';
  } else {
    path = '<path d="M60 20L60 100"/><path d="M35 45L60 20L85 45"/>';
  }

  arrowSvg.innerHTML = '<g stroke="' + color + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">' + path + '</g>';
}

function directionLabel(dir) {
  if (dir === "left") { return "Turn Left"; }
  if (dir === "right") { return "Turn Right"; }
  if (dir === "arrive") { return "Arrived"; }
  return "Go Straight";
}

function reverseDir(dir) {
  if (dir === "left") { return "right"; }
  if (dir === "right") { return "left"; }
  return dir;
}

function getArrivalPhoto(place) {
  var arrivalPhotos = {
    library: "images/corridor_lib.jpg",
    kings: "images/corridor_kings.jpg",
    registrar: "images/corridor_reg.jpg",
    indigenous: "images/hallway_board.jpg",
    theater: "images/theater_area.jpg",
    it: "images/corridor_it.jpg",
    entrance: "images/hallway_main.jpg"
  };
  
  if (arrivalPhotos[place]) {
    return arrivalPhotos[place];
  } else {
    return "images/hallway_main.jpg";
  }
}