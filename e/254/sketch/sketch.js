let shapes = [];
let connections = [];
let time = 0;
let baseGeometry;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create base geometry
  baseGeometry = [];
  for (let i = 0; i < 20; i++) {
    let angle = map(i, 0, 20, 0, TWO_PI);
    let x = cos(angle) * 150;
    let y = sin(angle) * 150;
    let z = random(-50, 50);
    baseGeometry.push({x, y, z});
  }
  
  // Initialize shapes
  for (let i = 0; i < 30; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(20, 60),
      hue: random(360),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.2) * 200;
  let cy = cos(time * 0.3) * 150;
  let cz = sin(time * 0.1) * 100;
  camera(0, 0, cz + 500, cx, cy, 0, 0, 1, 0);
  
  // Draw connections
  connections = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let d = dist(shapes[i].x, shapes[i].y, shapes[i].z, 
                   shapes[j].x, shapes[j].y, shapes[j].z);
      if (d < 200) {
        connections.push({i, j, distance: d});
      }
    }
  }
  
  // Draw shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    push();
    translate(s.x, s.y, s.z);
    rotateX(time * s.speed);
    rotateY(time * s.speed * 0.7);
    rotateZ(time * s.speed * 0.3);
    
    // Morph shape based on time
    let morph = sin(time + i) * 0.5 + 0.5;
    let size = s.size * (0.8 + morph * 0.4);
    
    // Glow effect
    fill(s.hue, 80, 100, 0.8);
    noStroke();
    
    if (morph < 0.3) {
      // Crystalline facets
      for (let j = 0; j < 8; j++) {
        let angle = map(j, 0, 8, 0, TWO_PI);
        let x = cos(angle) * size * 0.6;
        let y = sin(angle) * size * 0.6;
        let z = random(-size/2, size/2);
        
        push();
        translate(x, y, z);
        box(size * 0.3);
        pop();
      }
    } else {
      // Smooth form
      sphere(size * 0.5);
    }
    
    pop();
  }
  
  // Draw connections
  stroke(200, 80, 100, 0.6);
  strokeWeight(1);
  beginShape(LINES);
  for (let c of connections) {
    let s1 = shapes[c.i];
    let s2 = shapes[c.j];
    
    vertex(s1.x, s1.y, s1.z);
    vertex(s2.x, s2.y, s2.z);
  }
  endShape();
  
  // Add some particle effects
  for (let i = 0; i < 50; i++) {
    let angle = time + i * 0.1;
    let radius = 300 + sin(time * 0.5 + i) * 100;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.3 + i) * 100;
    
    push();
    translate(x, y, z);
    fill(240, 80, 100, 0.7);
    noStroke();
    sphere(2);
    pop();
  }
}
