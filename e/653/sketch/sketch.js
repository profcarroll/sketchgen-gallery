let lines = [];
let points = [];
let grid;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize abstract light streaks
  for (let i = 0; i < 200; i++) {
    points.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(360),
      sat: random(50, 100),
      bri: random(50, 100),
      size: random(2, 8)
    });
  }

  // Initialize grid structure
  grid = [];
  for (let x = -width/2; x < width/2; x += 40) {
    for (let y = -height/2; y < height/2; y += 40) {
      grid.push({x, y, z: 0});
    }
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Abstract light streaks
  if (time < 5) {
    for (let p of points) {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Bounce off edges
      if (p.x < -width/2 || p.x > width/2) p.vx *= -1;
      if (p.y < -height/2 || p.y > height/2) p.vy *= -1;
      if (p.z < -100 || p.z > 100) p.vz *= -1;

      // Draw point
      push();
      translate(p.x, p.y, p.z);
      noStroke();
      fill(p.hue, p.sat, p.bri, 0.7);
      sphere(p.size);
      pop();
    }
  }

  // Transition to geometric grid
  else if (time < 15) {
    let t = map(time, 5, 15, 0, 1);
    
    for (let p of points) {
      let targetX = map(noise(p.x * 0.01, p.y * 0.01, time), 0, 1, -width/2, width/2);
      let targetY = map(noise(p.y * 0.01, p.x * 0.01, time), 0, 1, -height/2, height/2);
      
      p.x += (targetX - p.x) * 0.05;
      p.y += (targetY - p.y) * 0.05;

      push();
      translate(p.x, p.y, p.z);
      noStroke();
      fill(p.hue, p.sat, p.bri, 0.7);
      sphere(p.size);
      pop();
    }
  }

  // Stable geometric grid
  else {
    for (let i = 0; i < grid.length; i++) {
      let g = grid[i];
      
      let n1 = noise(g.x * 0.02, g.y * 0.02, time);
      let n2 = noise(g.x * 0.03, g.y * 0.03, time + 100);
      
      let intensity = map(n1, 0, 1, 0.2, 0.8);
      let size = map(n2, 0, 1, 1, 5);
      
      push();
      translate(g.x, g.y, g.z);
      noStroke();
      fill(240, 80, 90, intensity);
      sphere(size);
      pop();
    }

    // Draw grid lines
    stroke(240, 80, 90, 0.3);
    noFill();
    
    for (let x = -width/2; x < width/2; x += 40) {
      beginShape();
      for (let y = -height/2; y < height/2; y += 40) {
        vertex(x, y, 0);
      }
      endShape();
    }

    for (let y = -height/2; y < height/2; y += 40) {
      beginShape();
      for (let x = -width/2; x < width/2; x += 40) {
        vertex(x, y, 0);
      }
      endShape();
    }
  }
}
