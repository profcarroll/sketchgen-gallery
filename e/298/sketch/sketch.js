let particles = [];
let connections = [];
const particleCount = 150;
const connectionDistance = 120;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(10, 30),
      hue: random(360),
      sat: random(70, 100),
      bri: random(80, 100)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;
  
  // Center of the scene
  const center = createVector(0, 0, 0);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Animate particle positions
    p.pos.add(p.vel);
    
    // Wrap around the scene
    if (p.pos.mag() > 600) {
      p.pos.normalize().mult(600);
    }
    
    // Apply some subtle pulsing effect to size and color
    const pulse = sin(time * 2 + i) * 0.5 + 0.5;
    p.size = map(pulse, 0, 1, 10, 30);
    p.hue += 0.2;
    
    // Draw the particle as a glowing sphere
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue % 360, p.sat, p.bri, 0.9);
    sphere(p.size, 4, 3); // Low detail for performance
    
    // Add a subtle inner glow
    fill(p.hue % 360, p.sat, 100, 0.5);
    sphere(p.size * 0.6, 4, 3);
    pop();
  }
  
  // Connect nearby particles with lines
  connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(
        particles[i].pos.x, particles[i].pos.y, particles[i].pos.z,
        particles[j].pos.x, particles[j].pos.y, particles[j].pos.z
      );
      
      if (d < connectionDistance) {
        connections.push({
          p1: particles[i],
          p2: particles[j],
          distance: d
        });
        
        // Limit number of connections drawn per frame
        if (connections.length > 1000) break;
      }
    }
    
    if (connections.length > 1000) break;
  }
  
  // Draw all connections
  stroke(255, 0.1);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let c of connections) {
    vertex(c.p1.pos.x, c.p1.pos.y, c.p1.pos.z);
    vertex(c.p2.pos.x, c.p2.pos.y, c.p2.pos.z);
  }
  endShape();
  
  // Rotate the whole scene slowly
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.2);
}
