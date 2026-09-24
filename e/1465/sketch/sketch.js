let stations = [];
let lines = [];
let clickedStation = null;
let transitionProgress = 0;
let targetPositions = [];

class Station {
  constructor(x, y, color, name) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.name = name;
    this.originalX = x;
    this.originalY = y;
    this.targetX = x;
    this.targetY = y;
  }
  
  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, 12, 12);
    fill(0);
    textSize(10);
    textAlign(CENTER, TOP);
    text(this.name, this.x, this.y + 15);
  }
  
  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < 15;
  }
}

class Line {
  constructor(stationA, stationB) {
    this.stationA = stationA;
    this.stationB = stationB;
  }
  
  draw() {
    stroke(0);
    strokeWeight(2);
    line(this.stationA.x, this.stationA.y, this.stationB.x, this.stationB.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  
  // Create stations
  stations = [
    new Station(100, 100, color(255, 0, 0), "A"),
    new Station(200, 100, color(0, 255, 0), "B"),
    new Station(300, 100, color(0, 0, 255), "C"),
    new Station(200, 200, color(255, 255, 0), "D"),
    new Station(100, 200, color(255, 0, 255), "E"),
    new Station(300, 200, color(0, 255, 255), "F")
  ];
  
  // Create lines
  lines = [
    new Line(stations[0], stations[1]),
    new Line(stations[1], stations[2]),
    new Line(stations[1], stations[3]),
    new Line(stations[0], stations[4]),
    new Line(stations[2], stations[5]),
    new Line(stations[3], stations[5]),
    new Line(stations[3], stations[4])
  ];
  
  // Set up target positions
  for (let i = 0; i < stations.length; i++) {
    targetPositions.push({x: stations[i].originalX, y: stations[i].originalY});
  }
}

function draw() {
  background(240);
  
  // Draw lines first
  for (let line of lines) {
    line.draw();
  }
  
  // Draw stations
  for (let station of stations) {
    station.draw();
  }
}

function mousePressed() {
  // Find clicked station
  for (let station of stations) {
    if (station.isClicked(mouseX, mouseY)) {
      clickedStation = station;
      break;
    }
  }
  
  if (clickedStation) {
    // Calculate new positions
    let centerX = clickedStation.originalX;
    let centerY = clickedStation.originalY;
    
    for (let i = 0; i < stations.length; i++) {
      let s = stations[i];
      let dx = s.originalX - centerX;
      let dy = s.originalY - centerY;
      
      // Apply transformation: move away from clicked station
      let distFromCenter = sqrt(dx * dx + dy * dy);
      let strength = 100 / (distFromCenter + 50);
      
      targetPositions[i].x = s.originalX + dx * strength * 0.3;
      targetPositions[i].y = s.originalY + dy * strength * 0.3;
    }
    
    // Start transition
    transitionProgress = 0;
    loop();
  }
}

function draw() {
  background(240);
  
  // Interpolate positions during transition
  if (transitionProgress < 1) {
    transitionProgress += 0.05;
    
    for (let i = 0; i < stations.length; i++) {
      let s = stations[i];
      s.x = lerp(s.originalX, targetPositions[i].x, transitionProgress);
      s.y = lerp(s.originalY, targetPositions[i].y, transitionProgress);
    }
    
    // Redraw
    redraw();
  } else {
    // Set final positions
    for (let i = 0; i < stations.length; i++) {
      let s = stations[i];
      s.x = targetPositions[i].x;
      s.y = targetPositions[i].y;
    }
    
    noLoop(); // Stop animation
  }
  
  // Draw lines and stations
  for (let line of lines) {
    line.draw();
  }
  
  for (let station of stations) {
    station.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
