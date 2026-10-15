let filaments = [];
let pulseSpeed = 0.02;
let pulseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a dense network of interlocking filaments
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    
    // Create a filament with multiple segments
    let segments = [];
    let numSegments = floor(random(5, 15));
    
    for (let j = 0; j < numSegments; j++) {
      let segX = x + random(-20, 20);
      let segY = y + random(-20, 20);
      let segZ = z + random(-10, 10);
      
      segments.push({
        x: segX,
        y: segY,
        z: segZ,
        radius: random(1.5, 4)
      });
    }
    
    filaments.push({
      segments: segments,
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 30, 5); // Deep dark background
  
  // Update pulse phase for rhythmic motion
  pulseOffset += pulseSpeed;
  
  // Set up lighting
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(255, 255, 255, 0, height/2, 0);
  ambientMaterial(100, 40, 20); // Base material for rusted steel
  
  // Draw filaments
  for (let filament of filaments) {
    beginShape();
    
    for (let i = 0; i < filament.segments.length - 1; i++) {
      let seg1 = filament.segments[i];
      let seg2 = filament.segments[i + 1];
      
      // Apply pulsing effect to filament radius
      let pulse = sin(pulseOffset + filament.pulsePhase + i * 0.2) * 0.5 + 0.5;
      let radius = seg1.radius * (0.8 + pulse * 0.4);
      
      // Create a subtle color variation for rusted appearance
      let hue = map(seg1.x, -width/2, width/2, 10, 30);
      let sat = map(seg1.y, -height/2, height/2, 60, 80);
      let bri = map(seg1.z, -100, 100, 10, 40);
      
      fill(hue, sat, bri, 0.9);
      
      // Draw filament segments
      vertex(seg1.x, seg1.y, seg1.z);
    }
    
    endShape();
    
    // Draw connections between segments
    stroke(20, 30, 15, 0.8);
    strokeWeight(1);
    noFill();
    
    beginShape(LINES);
    for (let i = 0; i < filament.segments.length - 1; i++) {
      let seg1 = filament.segments[i];
      let seg2 = filament.segments[i + 1];
      
      vertex(seg1.x, seg1.y, seg1.z);
      vertex(seg2.x, seg2.y, seg2.z);
    }
    endShape();
  }
  
  // Add subtle rust texture through point particles
  stroke(30, 50, 10, 0.6);
  strokeWeight(1);
  
  beginShape(POINTS);
  for (let i = 0; i < 500; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
