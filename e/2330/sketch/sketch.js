let forms = [];
let connections = [];
let stress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize lattice of geometric shards
  for (let i = 0; i < 150; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(8, 25),
      speed: random(0.5, 2.0),
      angle: random(TWO_PI),
      angularVelocity: random(-0.1, 0.1),
      color: color(random(200, 255), random(50, 150), random(0, 50), 200),
      stress: 0,
      lastCollision: 0
    });
  }
}

function draw() {
  background(20);
  
  // Update and display shards
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Rapid mechanical movement with stress buildup
    form.x += cos(form.angle) * form.speed;
    form.y += sin(form.angle) * form.speed;
    form.angle += form.angularVelocity;
    
    // Wrap around screen
    if (form.x < -50) form.x = width + 50;
    if (form.x > width + 50) form.x = -50;
    if (form.y < -50) form.y = height + 50;
    if (form.y > height + 50) form.y = -50;
    
    // Stress buildup and sudden release
    form.stress += 0.01;
    if (form.stress > 1) {
      form.stress = 0;
      form.angle += random(-0.5, 0.5);
      form.size = random(8, 25);
      form.color = color(random(200, 255), random(50, 150), random(0, 50), 200);
    }
    
    // Draw shard
    fill(form.color);
    ellipse(form.x, form.y, form.size);
  }
  
  // Draw connections with stress-based intensity
  beginShape(LINES);
  let connectionCount = 0;
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    for (let j = i + 1; j < forms.length; j++) {
      if (connectionCount > 150) break;
      
      let other = forms[j];
      let d = dist(form.x, form.y, other.x, other.y);
      
      if (d < 80) {
        // Intense contrasting colors for high stress connections
        let intensity = map(d, 0, 80, 255, 30);
        stroke(255, 100, 0, intensity * 0.7); // Orange-red for stress
        vertex(form.x, form.y);
        vertex(other.x, other.y);
        connectionCount++;
      }
    }
  }
  endShape();
  
  // Occasionally trigger sudden shard collisions
  if (frameCount % 30 === 0) {
    let i = floor(random(forms.length));
    let j = floor(random(forms.length));
    if (i !== j) {
      let form1 = forms[i];
      let form2 = forms[j];
      let d = dist(form1.x, form1.y, form2.x, form2.y);
      
      if (d < 30) {
        // Sudden stress spike
        form1.stress = 1;
        form2.stress = 1;
        
        // Repel each other with high velocity
        let angle = atan2(form1.y - form2.y, form1.x - form2.x);
        form1.angle = angle + PI;
        form2.angle = angle;
      }
    }
  }
  
  stress += 0.05;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
