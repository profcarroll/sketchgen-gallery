let satellites = [];
let orbitalPlanes = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create orbital planes
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TWO_PI;
    const plane = {
      x: cos(angle),
      y: sin(angle),
      z: sin(angle * 0.5)
    };
    orbitalPlanes.push(plane);
  }

  // Create satellites
  for (let i = 0; i < 300; i++) {
    const angle = random(TWO_PI);
    const radius = random(150, 300);
    const height = random(-100, 100);
    
    satellites.push({
      angle: angle,
      radius: radius,
      height: height,
      speed: random(0.002, 0.008),
      hue: random(180, 360),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Center the view
  translate(0, 0, -500);

  // Draw orbital planes
  stroke(200, 30, 100, 0.1);
  noFill();
  
  for (let i = 0; i < orbitalPlanes.length; i++) {
    const plane = orbitalPlanes[i];
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const x = cos(a) * 300;
      const y = sin(a) * 300;
      const z = plane.z * 200;
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }

  // Update and draw satellites
  nodes = [];
  for (let i = 0; i < satellites.length; i++) {
    const sat = satellites[i];
    
    // Move satellite
    sat.angle += sat.speed;
    
    // Calculate position in 3D space
    const x = cos(sat.angle) * sat.radius;
    const y = sin(sat.angle) * sat.radius;
    const z = sat.height + sin(time * 0.5 + sat.angle) * 50;
    
    // Draw satellite
    push();
    translate(x, y, z);
    noStroke();
    fill(sat.hue, 80, 90, 0.8);
    sphere(sat.size);
    pop();
    
    // Store position for node detection
    if (i % 10 === 0) {
      nodes.push({x, y, z});
    }
  }

  // Draw intersection nodes
  noStroke();
  fill(200, 100, 100, 0.8);
  
  for (let i = 0; i < nodes.length; i++) {
    const node1 = nodes[i];
    
    for (let j = i + 1; j < nodes.length; j++) {
      const node2 = nodes[j];
      
      // Calculate distance
      const dx = node1.x - node2.x;
      const dy = node1.y - node2.y;
      const dz = node1.z - node2.z;
      const dist = sqrt(dx * dx + dy * dy + dz * dz);
      
      // If close enough, draw a bright node
      if (dist < 50) {
        const intensity = map(dist, 0, 50, 1, 0);
        fill(200, 100, 100 + intensity * 40, 0.8);
        
        push();
        translate((node1.x + node2.x) / 2, (node1.y + node2.y) / 2, (node1.z + node2.z) / 2);
        sphere(5 * intensity);
        pop();
      }
    }
  }

  // Add subtle pulsing light
  const pulse = sin(time * 2) * 0.2 + 0.8;
  pointLight(255, 255, 255, 0, 0, 0);
  ambientLight(100 * pulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
