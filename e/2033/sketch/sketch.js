let panels = [];
let energyPlumes = [];
let mouseForce = { x: 0, y: 0 };
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create corrugated panels
  for (let i = 0; i < 8; i++) {
    panels.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -100),
      sizeX: random(100, 300),
      sizeY: random(100, 300),
      rotation: random(TWO_PI),
      pulse: random(TWO_PI)
    });
  }

  // Create energy plumes
  for (let i = 0; i < 200; i++) {
    energyPlumes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -100),
      size: random(2, 8),
      hue: random(360),
      speed: random(0.01, 0.05),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0);

  // Camera movement
  let time = millis() * 0.0002;
  camera(
    sin(time) * width/3,
    sin(time * 0.7) * height/4,
    cos(time) * width/3 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Draw panels with corrugated effect
  for (let panel of panels) {
    push();
    translate(panel.x, panel.y, panel.z);
    rotateY(panel.rotation);
    
    // Breathing motion
    let pulse = sin(panel.pulse) * 0.1 + 1;
    scale(pulse, pulse, 1);
    
    // Panel shape with corrugation
    noStroke();
    fill(240, 50, 10); // Dark blue-gray for cardboard
    
    beginShape(QUADS);
    let segments = 12;
    for (let i = 0; i < segments; i++) {
      let angle1 = map(i, 0, segments, 0, TWO_PI);
      let angle2 = map(i + 1, 0, segments, 0, TWO_PI);
      
      let x1 = cos(angle1) * panel.sizeX/2;
      let y1 = sin(angle1) * panel.sizeY/2;
      let x2 = cos(angle2) * panel.sizeX/2;
      let y2 = sin(angle2) * panel.sizeY/2;
      
      // Create corrugated effect
      let corr = 5 * sin(angle1 * 3);
      vertex(x1, y1 + corr, 0);
      vertex(x2, y2 + corr, 0);
      vertex(x2, y2 - corr, 0);
      vertex(x1, y1 - corr, 0);
    }
    endShape();
    
    panel.pulse += 0.01;
    pop();
  }

  // Draw energy plumes
  for (let plume of energyPlumes) {
    push();
    translate(plume.x, plume.y, plume.z);
    
    // Pulsing and flowing motion
    let pulse = sin(plume.pulse) * 0.5 + 1;
    let size = plume.size * pulse;
    
    // Color based on hue
    fill(plume.hue, 100, 100);
    noStroke();
    
    // Draw energy plume as a glowing point with trail
    sphere(size);
    
    plume.pulse += plume.speed;
    pop();
  }

  // Mouse interaction effect
  if (isDragging) {
    for (let plume of energyPlumes) {
      let dx = plume.x - pmouseX;
      let dy = plume.y - pmouseY;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist < 200) {
        // Glitch effect
        let force = map(dist, 0, 200, 10, 0);
        let angle = atan2(dy, dx);
        
        plume.hue += force * 0.5;
        if (plume.hue > 360) plume.hue -= 360;
        
        // Make it flare
        fill(plume.hue, 100, 100 + force * 2);
        sphere(plume.size * (1 + force/50));
      }
    }
  }
}

function mousePressed() {
  isDragging = true;
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  // Update mouse force
  mouseForce.x = mouseX - pmouseX;
  mouseForce.y = mouseY - pmouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
