let floors = [];
let floorHeight = 20;
let isAnimating = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize with a few floors
  for (let i = 0; i < 5; i++) {
    addFloor();
  }
}

function draw() {
  background(20);
  
  // Draw ground
  fill(40);
  rect(0, height - 20, width, 20);
  
  // Draw all floors
  for (let floor of floors) {
    fill(floor.color);
    rect(floor.x, floor.y, floor.w, floor.h);
  }
}

function keyPressed() {
  addFloor();
  return false;
}

function addFloor() {
  // Create a new floor at the top
  let newFloor = {
    x: 0,
    y: 0,
    w: width,
    h: floorHeight,
    color: getColor()
  };
  
  if (floors.length > 0) {
    // Place on top of the highest floor
    let highest = floors[floors.length - 1];
    newFloor.y = highest.y - floorHeight;
  } else {
    // First floor at the top of the canvas
    newFloor.y = height - 20 - floorHeight;
  }
  
  floors.push(newFloor);
}

function getColor() {
  // Generate a unique color using golden angle to ensure distinct hues
  let hue = (floors.length * 137.5) % 360; // Golden angle increment
  let colorValue = color(hue, 80, 70);
  return colorValue;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
