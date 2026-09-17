let figures = [];
let grid = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of points for interaction
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      grid.push({x, y});
    }
  }

  // Generate fractured figures
  for (let i = 0; i < 15; i++) {
    figures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(30, 80),
      rotation: random(TWO_PI),
      color: color(random(240, 270), 80, 60, 0.8),
      shards: []
    });
  }

  // Create shards for each figure
  for (let f of figures) {
    let numShards = floor(random(5, 15));
    for (let i = 0; i < numShards; i++) {
      f.shards.push({
        angle: random(TWO_PI),
        distance: random(0, f.size * 0.8),
        size: random(2, 10),
        color: color(random(240, 270), 90, 70, 0.9)
      });
    }
  }
}

function draw() {
  background(0);
  noStroke();

  // Ambient lighting
  pointLight(255, 255, 255, 0, 0, 0);

  // Camera movement for dynamic effect
  let time = millis() * 0.0005;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  rotateY(time);
  rotateX(sin(time * 0.5) * 0.1);

  // Draw figures
  for (let f of figures) {
    push();
    translate(f.x, f.y, f.z);
    rotateZ(f.rotation);
    
    fill(f.color);
    sphere(f.size);

    // Draw shards
    for (let s of f.shards) {
      let x = cos(s.angle + time * 2) * s.distance;
      let y = sin(s.angle + time * 2) * s.distance;
      
      push();
      translate(x, y, 0);
      fill(s.color);
      sphere(s.size);
      pop();
    }

    pop();
  }

  // Interactive response to mouse movement
  for (let point of grid) {
    let d = dist(mouseX - width/2, mouseY - height/2, point.x - width/2, point.y - height/2);
    if (d < 100) {
      let angle = atan2(point.y - height/2, point.x - width/2);
      let force = map(d, 0, 100, 1, 0);

      for (let f of figures) {
        let dx = f.x - point.x;
        let dy = f.y - point.y;
        let distF = sqrt(dx*dx + dy*dy);
        if (distF < 150) {
          let forceF = map(distF, 0, 150, 1, 0);
          
          // Apply distortion to shards
          for (let s of f.shards) {
            s.angle += force * forceF * 0.02;
            s.distance += sin(time * 3 + s.angle) * 0.5;
          }
        }
      }
    }
  }

  // Animate the figures slightly over time
  for (let f of figures) {
    f.rotation += sin(time * 0.5) * 0.01;
  }
}
