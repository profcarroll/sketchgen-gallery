let forms = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  
  // Create initial bioluminescent forms
  for (let i = 0; i < 150; i++) {
    forms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(5, 20),
      hue: random(200, 255), // Deep blue to purple
      saturation: random(150, 255),
      brightness: random(100, 255),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      pulse: random(TWO_PI),
      tail: []
    });
  }
}

function draw() {
  background(0);
  
  time++;
  
  // Draw all forms
  beginShape(POINTS);
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Update position with organic motion
    form.angle += random(-0.01, 0.01);
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    form.z += random(-0.5, 0.5);
    
    // Wrap around screen edges
    if (form.x > width/2 + 100) form.x = -width/2 - 100;
    if (form.x < -width/2 - 100) form.x = width/2 + 100;
    if (form.y > height/2 + 100) form.y = -height/2 - 100;
    if (form.y < -height/2 - 100) form.y = height/2 + 100;
    
    // Pulsing effect
    form.pulse += 0.05;
    let pulseSize = sin(form.pulse) * 3 + form.size;
    
    // Update tail
    form.tail.push({x: form.x, y: form.y, z: form.z});
    if (form.tail.length > 20) {
      form.tail.shift();
    }
    
    // Draw glow point
    let pointSize = pulseSize / 5;
    fill(form.hue, form.saturation, form.brightness);
    vertex(form.x, form.y, form.z);
    
    // Draw tail ripples
    stroke(form.hue, form.saturation, form.brightness, 80);
    noFill();
    beginShape();
    for (let j = 0; j < form.tail.length; j++) {
      let point = form.tail[j];
      let t = j / form.tail.length;
      let rippleSize = sin(time * 0.05 + t * 10) * 2;
      vertex(point.x, point.y, point.z + rippleSize);
    }
    endShape();
    
    // Occasionally flash color
    if (random() < 0.01) {
      form.hue = random(240, 300); // Flash to purple
    }
    
    // Occasionally change color back to blue
    if (random() < 0.005) {
      form.hue = random(200, 255);
    }
  }
  endShape();
  
  // Draw connections between nearby forms using spatial hashing
  let grid = {};
  const cellSize = 100;
  
  // Hash forms into grid
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    let gridX = floor(form.x / cellSize);
    let gridY = floor(form.y / cellSize);
    let gridKey = gridX + ',' + gridY;
    
    if (!grid[gridKey]) grid[gridKey] = [];
    grid[gridKey].push(i);
  }
  
  // Draw connections
  beginShape(LINES);
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    let gridX = floor(form.x / cellSize);
    let gridY = floor(form.y / cellSize);
    
    // Check neighbors in current and adjacent cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let gridKey = (gridX + dx) + ',' + (gridY + dy);
        if (grid[gridKey]) {
          for (let j of grid[gridKey]) {
            if (i !== j) {
              let other = forms[j];
              let d = dist(form.x, form.y, other.x, other.y);
              if (d < 150 && d > 30) {
                // Draw connection line
                stroke(form.hue, form.saturation, form.brightness, 30);
                vertex(form.x, form.y, form.z);
                vertex(other.x, other.y, other.z);
              }
            }
          }
        }
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
