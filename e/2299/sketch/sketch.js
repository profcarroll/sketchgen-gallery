let stations = [];
let lines = [];
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cameraAngleX = 0;
let cameraAngleY = 0;

class Station {
  constructor(x, y, z, color, id) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.id = id;
    this.originalX = x;
    this.originalY = y;
    this.originalZ = z;
    this.radius = 8;
    this.isHovered = false;
  }
  
  draw() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    fill(this.color);
    sphere(this.radius, 8, 6);
    
    // Draw station label
    fill(255);
    textSize(12);
    textAlign(CENTER, TOP);
    text(this.id, 0, this.radius + 5);
    pop();
  }
  
  contains(mx, my) {
    let d = dist(mouseX - width/2, mouseY - height/2, this.x, this.y, this.z);
    return d < this.radius * 10;
  }
}

class Line {
  constructor(s1, s2, color) {
    this.s1 = s1;
    this.s2 = s2;
    this.color = color;
    this.originalLength = dist(s1.x, s1.y, s1.z, s2.x, s2.y, s2.z);
  }
  
  draw() {
    stroke(red(this.color), green(this.color), blue(this.color), 180);
    strokeWeight(3);
    line(this.s1.x, this.s1.y, this.s1.z, this.s2.x, this.s2.y, this.s2.z);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
  
  // Create stations
  stations.push(new Station(0, 0, 0, color(255, 100, 100), "A"));
  stations.push(new Station(100, 50, 0, color(100, 255, 100), "B"));
  stations.push(new Station(-100, -50, 0, color(100, 100, 255), "C"));
  stations.push(new Station(50, -100, 0, color(255, 255, 100), "D"));
  stations.push(new Station(-50, 100, 0, color(255, 100, 255), "E"));
  stations.push(new Station(0, 150, 0, color(100, 255, 255), "F"));
  
  // Create lines
  lines.push(new Line(stations[0], stations[1], color(255, 100, 100)));
  lines.push(new Line(stations[0], stations[2], color(100, 255, 100)));
  lines.push(new Line(stations[0], stations[3], color(255, 255, 100)));
  lines.push(new Line(stations[0], stations[4], color(255, 100, 255)));
  lines.push(new Line(stations[0], stations[5], color(100, 255, 255)));
}

function draw() {
  background(15);
  
  // Camera controls
  cameraAngleX += (mouseY - lastMouseY) * 0.005;
  cameraAngleY += (mouseX - lastMouseX) * 0.005;
  
  // Apply camera rotation
  rotateX(cameraAngleX);
  rotateY(cameraAngleY);
  
  // Draw lines first (behind stations)
  for (let line of lines) {
    line.draw();
  }
  
  // Draw stations
  for (let station of stations) {
    station.draw();
  }
}

function mousePressed() {
  let clickedStation = null;
  for (let station of stations) {
    if (station.contains(mouseX, mouseY)) {
      clickedStation = station;
      break;
    }
  }
  
  if (clickedStation) {
    // Shift the entire system when a station is clicked
    let shiftX = random(-50, 50);
    let shiftY = random(-50, 50);
    let shiftZ = random(-30, 30);
    
    for (let station of stations) {
      if (station !== clickedStation) {
        station.x += shiftX;
        station.y += shiftY;
        station.z += shiftZ;
        
        // Keep within bounds
        station.x = constrain(station.x, -200, 200);
        station.y = constrain(station.y, -200, 200);
        station.z = constrain(station.z, -100, 100);
      }
    }
    
    // Update lines to reflect new positions
    for (let line of lines) {
      line.s1.x = line.s1.originalX + shiftX;
      line.s1.y = line.s1.originalY + shiftY;
      line.s1.z = line.s1.originalZ + shiftZ;
      
      line.s2.x = line.s2.originalX + shiftX;
      line.s2.y = line.s2.originalY + shiftY;
      line.s2.z = line.s2.originalZ + shiftZ;
    }
    
    redraw();
  } else {
    // Regular dragging
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    redraw();
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
