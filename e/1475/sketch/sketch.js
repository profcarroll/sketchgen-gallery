let buildings = [];
let floorHeight = 20;
let currentFloor = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize buildings with fixed positions and heights
  for (let i = 0; i < 15; i++) {
    let x = i * 80;
    let w = 60;
    let h = random(100, 300);
    buildings.push({
      x: x,
      y: height - h,
      w: w,
      h: h
    });
  }
}

function draw() {
  background(50);
  
  // Draw ground
  fill(30);
  rect(0, height - 20, width, 20);
  
  // Draw buildings
  for (let building of buildings) {
    fill(100);
    rect(building.x, building.y, building.w, building.h);
    
    // Draw windows
    fill(255, 255, 0);
    for (let y = building.y + 10; y < building.y + building.h - 10; y += 20) {
      for (let x = building.x + 10; x < building.x + building.w - 10; x += 15) {
        rect(x, y, 8, 12);
      }
    }
  }
  
  // Draw new floor if any
  if (currentFloor > 0) {
    for (let i = 0; i < buildings.length; i++) {
      let building = buildings[i];
      let x = building.x;
      let y = building.y - currentFloor * floorHeight;
      let w = building.w;
      let h = floorHeight;
      
      fill(150);
      rect(x, y, w, h);
    }
  }
}

function keyPressed() {
  // Increment the height of the skyline
  currentFloor++;
  
  // Ensure we don't exceed a reasonable limit
  if (currentFloor > 20) {
    currentFloor = 20;
  }
  
  return false; // Prevent default behavior
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
