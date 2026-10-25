let roots = [];
let origamiPieces = [];
let glowIntensity = 0;
let pulseSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create jungle root system with folded origami structures
  for (let i = 0; i < 200; i++) {
    roots.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      length: random(30, 100),
      angle: random(TWO_PI),
      twist: random(-0.3, 0.3),
      segments: floor(random(3, 8)),
      hue: random(20, 40), // Earthy brown hues
      saturation: random(30, 50),
      brightness: random(60, 80),
      thickness: random(1, 3)
    });
  }
  
  // Create origami folded structures
  for (let i = 0; i < 150; i++) {
    origamiPieces.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(5, 20),
      angle: random(TWO_PI),
      hue: random(180, 220), // Cool blue for bioluminescence
      saturation: random(70, 90),
      brightness: random(80, 100),
      pulseSpeed: random(0.03, 0.06),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5); // Deep dark space
  ambientLight(20);
  pointLight(255, 255, 255, 0, 0, 300);
  
  let time = millis() * 0.001;
  
  // Center the view
  translate(0, 0, -400);
  
  // Slow rotation
  rotateY(time * 0.01);
  rotateX(sin(time * 0.05) * 0.03);
  
  // Draw root system with taut folded origami
  for (let i = 0; i < roots.length; i++) {
    let root = roots[i];
    
    push();
    translate(root.x, root.y, root.z);
    rotateZ(root.angle + time * root.twist);
    
    // Draw root segments as taut folded origami
    noFill();
    stroke(root.hue, root.saturation, root.brightness);
    strokeWeight(root.thickness);
    
    for (let j = 0; j < root.segments; j++) {
      let segmentLength = root.length / root.segments;
      let segmentX = cos(root.angle) * j * segmentLength;
      let segmentY = sin(root.angle) * j * segmentLength;
      
      // Create folded origami effect
      if (j % 2 === 0) {
        line(segmentX, segmentY, segmentX + cos(root.angle + PI/4) * segmentLength, 
             segmentY + sin(root.angle + PI/4) * segmentLength);
      } else {
        line(segmentX, segmentY, segmentX + cos(root.angle - PI/4) * segmentLength, 
             segmentY + sin(root.angle - PI/4) * segmentLength);
      }
    }
    
    pop();
  }
  
  // Draw bioluminescent origami pieces with pulsing
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < origamiPieces.length; i++) {
    let piece = origamiPieces[i];
    let pulse = sin(time * piece.pulseSpeed + piece.pulsePhase) * 0.5 + 0.5;
    fill(piece.hue, piece.saturation, piece.brightness, pulse * glowIntensity);
    vertex(piece.x, piece.y, piece.z);
  }
  endShape();
  
  // Update glow intensity
  glowIntensity = 0.3 + sin(time * pulseSpeed) * 0.2;
}

function mousePressed() {
  // Briefly brighten the glow on click
  glowIntensity = 1.0;
  setTimeout(() => {
    glowIntensity = 0.3 + sin(millis() * 0.001 * pulseSpeed) * 0.2;
  }, 200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
