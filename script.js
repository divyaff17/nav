/*
 * App Logic for Campus Navigator
 * Divya
 * Note: images are kinda huge so added a preloader spinner so it doesn't look broken
 */

const places = {
  entrance: { name: "Main Entrance", icon: "🏫" },
  library: { name: "Library", icon: "📚" },
  kings: { name: "King's Lounge", icon: "🛋" },
  registrar: { name: "Registrar Office", icon: "📄" },
  indigenous: { name: "Indigenous Center", icon: "🌿" },
  theater: { name: "Theater", icon: "🎭" },
  it: { name: "IT Department", icon: "💻" }
};

const edges = [
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

// build the map so we can look up routes locally 
let byFrom = {}; // changing to let just in case we fetch data later
edges.forEach(edge => {
  if (!byFrom[edge.from]) byFrom[edge.from] = [];
  if (!byFrom[edge.to]) byFrom[edge.to] = [];
  
  byFrom[edge.from].push(edge);
  
  // push the reverse path automatically
  byFrom[edge.to].push({
    from: edge.to,
    to: edge.from,
    dir: reverseDir(edge.dir),
    photo: edge.photo,
    text: edge.text
  });
});

const fromSelect = document.getElementById("fromSelect");
const toSelect = document.getElementById("toSelect");
const buildBtn = document.getElementById("buildBtn");
// swapBtn removed since start is fixed
const routeSummary = document.getElementById("routeSummary");
const stage = document.getElementById("stage");
const timeline = document.getElementById("timeline");
const feedback = document.getElementById("feedback");

const stepTitle = document.getElementById("stepTitle");
const stepCounter = document.getElementById("stepCounter");
const stepPhoto = document.getElementById("stepPhoto");
const arrowSvg = document.getElementById("arrowSvg");
const arrowText = document.getElementById("arrowText");
const stepDesc = document.getElementById("stepDesc");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const photoFrame = document.getElementById("photoFrame");
const imageLoader = document.getElementById("imageLoader");

let currentSteps = [];
let currentStepIndex = 0;

// populate dropdowns
populateSelects();

// swap button logic removed

buildBtn.addEventListener("click", () => {
  feedback.textContent = "";
  const start = "kings"; // hardcoded fixed start
  const end = toSelect.value;

  if (!end) {
    feedback.textContent = "Select a destination.";
    return;
  }
  
  if (start === end) {
    feedback.textContent = "Start and destination cannot be the same.";
    return;
  }

  // TODO: maybe abstract this routing block later if it gets too complex
  const pathEdges = findShortestRoute(start, end);
  if (!pathEdges.length) {
    feedback.textContent = "No route found for this combination.";
    return;
  }

  // format into ui steps
  currentSteps = pathEdges.map((edge, i) => ({
    title: `Step ${i + 1} - ${directionLabel(edge.dir)}`,
    desc: edge.text,
    photo: edge.photo,
    dir: edge.dir
  }));

  currentSteps.push({
    title: "Arrived",
    desc: `You have successfully reached the ${places[end].name}.`,
    photo: getArrivalPhoto(end),
    dir: "arrive"
  });

  currentStepIndex = 0;
  
  routeSummary.classList.remove("hidden");
  stage.classList.remove("hidden");
  timeline.classList.remove("hidden");
  
  routeSummary.innerHTML = `
    <span>${places[start].icon} ${places[start].name}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    <span>${places[end].icon} ${places[end].name}</span>
    <span style="opacity:0.5; margin-left:10px;">|</span>
    <span style="margin-left:10px;">${currentSteps.length} steps</span>
  `;
  
  renderStep();
  renderTimeline();
});

prevBtn.addEventListener("click", () => {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
    renderTimeline();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentStepIndex < currentSteps.length - 1) {
    currentStepIndex++;
    renderStep();
    renderTimeline();
  }
});

function renderStep() {
  const step = currentSteps[currentStepIndex];
  
  // trigger css transition
  photoFrame.classList.remove('in');
  photoFrame.classList.add('out');
  stepDesc.classList.remove('in');
  stepDesc.classList.add('out');
  
  // lock buttons until we load (prevent double click bugs)
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  // wait for the fade to finish before swapping the text
  setTimeout(() => {
    stepTitle.textContent = step.title;
    stepCounter.textContent = `Step ${currentStepIndex + 1} of ${currentSteps.length}`;
    stepDesc.textContent = step.desc;
    arrowText.textContent = directionLabel(step.dir);
    drawArrow(step.dir);
    
    // flash the loader
    imageLoader.classList.remove('out');
    imageLoader.classList.add('in');
    
    const img = new Image();
    img.onload = () => {
      stepPhoto.src = step.photo;
      
      imageLoader.classList.remove('in');
      imageLoader.classList.add('out');
      
      photoFrame.classList.remove('out');
      photoFrame.classList.add('in');
      
      stepDesc.classList.remove('out');
      stepDesc.classList.add('in');
      
      prevBtn.disabled = currentStepIndex === 0;
      nextBtn.disabled = currentStepIndex === currentSteps.length - 1;
    };
    
    // fallback if the image is missing entirely
    img.onerror = () => {
      // console.log("error loading photo", step.photo);
      stepPhoto.src = step.photo;
      imageLoader.classList.add('out');
      photoFrame.classList.add('in');
      stepDesc.classList.add('in');
      prevBtn.disabled = currentStepIndex === 0;
      nextBtn.disabled = currentStepIndex === currentSteps.length - 1;
    };
    
    img.src = step.photo;
  }, 300);
}

function renderTimeline() {
  timeline.innerHTML = "";
  
  currentSteps.forEach((step, index) => {
    const card = document.createElement("article");
    card.className = "timeline-card" + (index === currentStepIndex ? " active" : "");
    
    card.innerHTML = `
      <img src="${step.photo}" alt="${step.title}">
      <p>${index + 1}. ${directionLabel(step.dir)}</p>
    `;
    
    card.addEventListener("click", () => {
      if (currentStepIndex !== index) {
        currentStepIndex = index;
        renderStep();
        renderTimeline();
      }
    });
    
    timeline.appendChild(card);
  });
}

function populateSelects() {
  toSelect.innerHTML = '<option value="" disabled selected>Select Destination...</option>';
  
  Object.keys(places).forEach(key => {
    // don't put the starting point in the destination list!
    if (key === "kings") return; 
    
    const place = places[key];
    const optionText = `${place.icon} ${place.name}`;
    
    toSelect.appendChild(new Option(optionText, key));
  });
}

// standard bfs routing
function findShortestRoute(start, end) {
  // old way: var queue = [{ node: start, path: [] }]; 
  const queue = [{ node: start, path: [] }];
  const visited = { [start]: true };

  while (queue.length) {
    const current = queue.shift();
    if (current.node === end) return current.path;

    const neighbors = byFrom[current.node] || [];
    neighbors.forEach(edge => {
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        queue.push({
          node: edge.to,
          path: current.path.concat(edge)
        });
      }
    });
  }
  return []; // no route
}

// simple inline svg drawing for the arrows
function drawArrow(dir) {
  const color = dir === "arrive" ? "var(--accent-arrive)" : "var(--accent-glow)";
  let path = "";

  if (dir === "left") {
    path = '<g transform="translate(60 60) rotate(-90) translate(-60 -60)"><path d="M60 20L60 100"/><path d="M35 45L60 20L85 45"/></g>';
  } else if (dir === "right") {
    path = '<g transform="translate(60 60) rotate(90) translate(-60 -60)"><path d="M60 20L60 100"/><path d="M35 45L60 20L85 45"/></g>';
  } else if (dir === "arrive") {
    path = '<circle cx="60" cy="60" r="36"/><path d="M42 60l12 12 24-24"/>';
  } else {
    // defaults straight
    path = '<path d="M60 20L60 100"/><path d="M35 45L60 20L85 45"/>';
  }

  arrowSvg.innerHTML = `<g stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">${path}</g>`;
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

// matches exactly what you get when finding the end place
function getArrivalPhoto(place) {
  const arrivalPhotos = {
    library: "images/corridor_lib.jpg",
    kings: "images/corridor_kings.jpg",
    registrar: "images/corridor_reg.jpg",
    indigenous: "images/hall_center.jpg",
    theater: "images/theater_area.jpg",
    it: "images/corridor_it.jpg",
    entrance: "images/hallway_main.jpg"
  };
  return arrivalPhotos[place] || "images/hallway_main.jpg";
}