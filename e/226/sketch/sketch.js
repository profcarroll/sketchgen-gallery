let pathways = [];
let intersections = [];
const NUM_PATHWAYS = 150;
const INTERSECTION_COUNT = 30;
const PULSE_SPEED = 0.02;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pathways
  for (let i = 0; i < NUM_PATHWAYS; i++) {
    let path = {
      points: [],
      hue: random(360),
      speed: random(0.5, 2),
      time: random(1000),
      width: random(1, 4)
    };
    
    // Create a path with 50 points
    for (let j = 0; j < 50; j++) {
      let x = random(width);
      let y = random(height);
      path.points.push({x, y});
    }
    
    pathways.push(path);
  }
  
  // Create intersections at random positions
  for (let i = 0; i < INTERSECTION_COUNT; i++) {
    intersections.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      pulse: 0,
      hue: random(360)
    });
  }
}

function draw() {
  background(20, 5, 10);
  
  // Update and draw pathways
  for (let path of pathways) {
    path.time += path.speed * PULSE_SPEED;
    
    // Draw the pathway
    noFill();
    stroke(path.hue, 80, 90, 0.7);
    strokeWeight(path.width);
    beginShape();
    for (let i = 0; i < path.points.length; i++) {
      let point = path.points[i];
      let x = point.x + sin(path.time + i * 0.1) * 10;
      let y = point.y + cos(path.time + i * 0.1) * 10;
      
      curveVertex(x, y);
    }
    endShape();
    
    // Connect intersections to pathways
    for (let inter of intersections) {
      let d = dist(inter.x, inter.y, path.points[0].x, path.points[0].y);
      if (d < 100) {
        stroke(path.hue, 80, 90, 0.3);
        strokeWeight(0.5);
        line(inter.x, inter.y, path.points[0].x, path.points[0].y);
      }
    }
  }
  
  // Update and draw intersections
  for (let inter of intersections) {
    inter.pulse += PULSE_SPEED * 2;
    
    // Draw intersection with pulsing glow
    noStroke();
    fill(inter.hue, 100, 100, 0.5 + sin(inter.pulse) * 0.3);
    ellipse(inter.x, inter.y, inter.size + sin(inter.pulse) * 5, inter.size + sin(inter.pulse) * 5);
    
    // Draw core glow
    fill(inter.hue, 100, 100, 0.8);
    ellipse(inter.x, inter.y, inter.size * 0.6, inter.size * 0.6);
  }
  
  // Connect intersections to each other
  for (let i = 0; i < intersections.length; i++) {
    for (let j = i + 1; j < intersections.length; j++) {
      let d = dist(intersections[i].x, intersections[i].y, intersections[j].x, intersections[j].y);
      if (d < 150) {
        stroke(200, 80, 90, 0.3);
        strokeWeight(0.5);
        line(intersections[i].x, intersections[i].y, intersections[j].x, intersections[j].y);
      }
    }
  }
}
