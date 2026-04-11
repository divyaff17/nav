

var places = {
  entrance: { name: "Theater", icon: "🎭" },
  library: { name: "Library", icon: "📚" },
  kings: { name: "King's Lounge", icon: "🛋" },
  registrar: { name: "Registrar Office", icon: "📄" },
  indigenous: { name: "Indigenous Center", icon: "🏫" },
  bookstore: { name: "Book Store", icon: "📚" }
};

var edges = [
  { from: "entrance", to: "wp_start", dir: "straight", photo: "images/hallway_main.jpg", text: "Walk from the Main Entrance down the corridor." },
  { from: "wp_start", to: "wp_k1", dir: "right", photo: "images/lobby.jpg", text: "Walk toward the main lobby." },
  { from: "wp_k1", to: "wp_k2", dir: "right", photo: "images/corridor_west.jpg", text: "Take the West corridor." },
  { from: "entrance", to: "lib1", dir: "left", photo: "images/lib_step_1.jpeg", text: "Image 1 (Start Point)\nTurn left \u2192 go to Image 2" },
  { from: "lib1", to: "lib2", dir: "left", photo: "images/lib_step_2.jpeg", text: "Image 2\nGo straight\nThen turn left \u2192 go to Image 3" },
  { from: "lib2", to: "lib3", dir: "right", photo: "images/lib_step_3.jpeg", text: "Image 3\nGo straight\nThen turn right\nCafeteria is on the right \u2192 Image 4" },
  { from: "lib3", to: "lib4", dir: "left", photo: "images/lib_step_4.jpeg", text: "Image 4 (Cafeteria Point)\nTurn left \u2192 go to Image 5" },
  { from: "lib4", to: "lib5", dir: "straight", photo: "images/lib_step_5.jpeg", text: "Image 5\nGo straight \u2192 go to Image 6" },
  { from: "lib5", to: "lib6", dir: "left", photo: "images/lib_step_6.jpeg", text: "Image 6\nTurn left \u2192 go to Image 7" },
  { from: "lib6", to: "lib7", dir: "left", photo: "images/lib_step_7.jpeg", text: "Image 7\nTurn left \u2192 go to Image 8" },
  { from: "lib7", to: "library", dir: "left", photo: "images/lib_step_8.jpeg", text: "Image 8\nGo straight\nThen turn left\nLibrary is on the left \u2192 Image 10" },
  { from: "entrance", to: "reg1", dir: "left", photo: "images/reg_step_1.jpeg", text: "Start at Point 1. Turn left to reach Point 2." },
  { from: "entrance", to: "ind1", dir: "left", photo: "images/pdf_step_1.jpeg", text: "1 then left" },
  { from: "ind1", to: "ind2", dir: "straight", photo: "images/pdf_step_2.jpeg", text: "2 go straight" },
  { from: "ind2", to: "ind3", dir: "left", photo: "images/pdf_step_3.jpeg", text: "and then left" },
  { from: "ind3", to: "ind4", dir: "straight", photo: "images/pdf_step_4.jpeg", text: "3 go straight" },
  { from: "ind4", to: "ind5", dir: "right", photo: "images/pdf_step_5.jpeg", text: "and then right is cafeteria" },
  { from: "ind5", to: "ind6", dir: "left", photo: "images/pdf_step_6.jpeg", text: "4 and then left" },
  { from: "ind6", to: "ind7", dir: "straight", photo: "images/pdf_step_7.jpeg", text: "5 go straight" },
  { from: "ind7", to: "ind8", dir: "right", photo: "images/pdf_step_8.jpeg", text: "6 and go right" },
  { from: "ind8", to: "ind9", dir: "straight", photo: "images/pdf_step_9.jpeg", text: "7 go straight" },
  { from: "ind9", to: "ind10", dir: "left", photo: "images/pdf_step_10.jpeg", text: "and left" },
  { from: "ind10", to: "ind11", dir: "straight", photo: "images/pdf_step_11.jpeg", text: "8 go straight" },
  { from: "ind11", to: "ind12", dir: "straight", photo: "images/pdf_step_12.jpeg", text: "9 go straight" },
  { from: "ind12", to: "indigenous", dir: "right", photo: "images/pdf_step_13.jpeg", text: "10 right is indigenous academic centre" },
  { from: "entrance", to: "king1", dir: "left", photo: "images/king_step_1.jpeg", text: "Image 1 (Start)\nTurn left \u2192 go to Image 2" },
  { from: "king1", to: "king2", dir: "left", photo: "images/king_step_2.jpeg", text: "Image 2\nGo straight\nThen turn left \u2192 go to Image 3" },
  { from: "king2", to: "king3", dir: "right", photo: "images/king_step_3.jpeg", text: "Image 3\nGo straight\nThen turn right\nCafeteria is on the right \u2192 go to Image 4" },
  { from: "king3", to: "king4", dir: "left", photo: "images/king_step_4.jpeg", text: "Image 4\nTurn left \u2192 go to Image 5" },
  { from: "king4", to: "king5", dir: "straight", photo: "images/king_step_5.jpeg", text: "Image 5\nGo straight \u2192 go to Image 6" },
  { from: "king5", to: "king6", dir: "left", photo: "images/king_step_6.jpeg", text: "Image 6\nGo straight\nThen turn left \u2192 go to Image 7" },
  { from: "king6", to: "king7", dir: "left", photo: "images/king_step_7.jpeg", text: "Image 7\nTurn left \u2192 go to Image 8" },
  { from: "king7", to: "king8", dir: "straight", photo: "images/king_step_8.jpeg", text: "Image 8\nGo straight \u2192 go to Image 9" },
  { from: "king8", to: "king9", dir: "straight", photo: "images/king_step_9.jpeg", text: "Image 9\nGo straight \u2192 go to Image 10" },
  { from: "king9", to: "king10", dir: "left", photo: "images/king_step_10.jpeg", text: "Image 10\nGo straight\nThen turn left \u2192 go to Image 11" },
  { from: "king10", to: "kings", dir: "straight", photo: "images/king_step_11.jpeg", text: "Image 11\nGo straight \u2192 go to Image 12" },
  { from: "reg1", to: "reg2", dir: "straight", photo: "images/reg_step_2.jpeg", text: "Go straight to reach Point 3." },
  { from: "reg2", to: "reg3", dir: "left", photo: "images/reg_step_3.jpeg", text: "Turn left at Point 3 and go straight." },
  { from: "reg3", to: "reg4", dir: "right", photo: "images/reg_step_4.jpeg", text: "Turn right — Cafeteria is on the right (Point 4)." },
  { from: "reg4", to: "reg5", dir: "left", photo: "images/reg_step_5.jpeg", text: "From Point 4, turn left to reach Point 5." },
  { from: "reg5", to: "reg6", dir: "straight", photo: "images/reg_step_6.jpeg", text: "Go straight to reach Point 6." },
  { from: "reg6", to: "registrar", dir: "left", photo: "images/reg_step_7.jpeg", text: "Turn left to reach Point 7. Turn left again to reach Point 8." },
  { from: "entrance", to: "book1", dir: "left", photo: "images/book_step_1.jpeg", text: "Image 1 (Start Point)\nTurn left \u2192 reach Image 2" },
  { from: "book1", to: "book2", dir: "left", photo: "images/book_step_2.jpeg", text: "Image 2\nGo straight\nThen turn left \u2192 reach Image 3" },
  { from: "book2", to: "book3", dir: "right", photo: "images/book_step_3.jpeg", text: "Image 3\nGo straight\nThen turn right\nCafeteria is on the right \u2192 reach Image 4" },
  { from: "book3", to: "book4", dir: "left", photo: "images/book_step_4.jpeg", text: "Image 4 (Cafeteria Point)\nTurn left \u2192 reach Image 5" },
  { from: "book4", to: "bookstore", dir: "straight", photo: "images/book_step_5.jpeg", text: "Image 5\nGo straight \u2192 reach Image 6" }
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
  var start = "entrance";
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

  var arrivalDesc = "You have successfully reached the " + places[end].name + ".";
  if (end === "registrar") {
    arrivalDesc = "Go straight. Turn right — Registrar Office is on the right.";
  } else if (end === "bookstore") {
    arrivalDesc = "Image 6\nGo straight\nBookstore is ahead / at this point (Destination)";
  } else if (end === "kings") {
    arrivalDesc = "Image 12 (Destination)\nTurn right\nKing's Lounge is on the right";
  }
  
  currentSteps.push({
    title: "Arrived",
    desc: arrivalDesc,
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
    stepDesc.innerHTML = step.desc.replace(/\n/g, '<br>');
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
      if (key === "entrance") {
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
    library: "images/lib_step_10.jpeg",
    kings: "images/king_step_12.jpeg",
    registrar: "images/reg_step_8.jpeg",
    indigenous: "images/pdf_step_14.jpeg",
    bookstore: "images/book_step_6.jpeg",
    entrance: "images/hallway_main.jpg"
  };
  
  if (arrivalPhotos[place]) {
    return arrivalPhotos[place];
  } else {
    return "images/hallway_main.jpg";
  }
}