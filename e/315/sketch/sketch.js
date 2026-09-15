let forms = [];
let colors = [
  [255, 100, 100], [100, 255, 100], [100, 100, 255],
  [255, 255, 100], [255, 100, 255], [100, 255, 255]
];
let colorIndex = 0;

function setup() {
  createCanvas(600, 600);
  noStroke();
  
  for (let i = 0; i < 20; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      connections: []
    });
  }
}

function draw() {
  background(10);
  
  // Update and draw forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Move form
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    
    // Bounce off edges
    if (form.x < 0 || form.x > width) form.angle = PI - form.angle;
    if (form.y < 0 || form.y > height) form.angle = -form.angle;
    
    // Update connections
    form.connections = [];
    for (let j = 0; j < forms.length; j++) {
      if (i !== j) {
        let other = forms[j];
        let d = dist(form.x, form.y, other.x, other.y);
        if (d < 150) {
          form.connections.push({
            x: other.x,
            y: other.y,
            alpha: map(d, 0, 150, 255, 30)
          });
        }
      }
    }
    
    // Draw connections
    for (let conn of form.connections) {
      stroke(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2], conn.alpha);
      line(form.x, form.y, conn.x, conn.y);
    }
    
    // Draw form
    fill(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2], 200);
    ellipse(form.x, form.y, form.size);
    
    // Add some deformation to shape
    push();
    translate(form.x, form.y);
    rotate(frameCount * 0.01);
    fill(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2], 150);
    ellipse(0, 0, form.size * 0.7);
    pop();
  }
  
  // Change color every 120 frames
  if (frameCount % 120 === 0) {
    colorIndex = (colorIndex + 1) % colors.length;
  }
}
