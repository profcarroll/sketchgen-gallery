let filaments = [];
let strata = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  
  // Create layered earth strata
  for (let i = 0; i < 8; i++) {
    strata.push({
      y: height * (i / 8),
      height: height / 8,
      color: color(
        100 + random(30),
        70 + random(20),
        40 + random(15),
        200
      )
    });
  }
  
  // Initialize filaments
  for (let i = 0; i < 500; i++) {
    filaments.push({
      x: random(width),
      y: random(height),
      age: 0,
      maxAge: random(200, 500),
      segments: [],
      growthRate: random(0.01, 0.03),
      color: color(
        80 + random(40),
        60 + random(20),
        40 + random(10),
        180
      )
    });
  }
}

function draw() {
  background(30);
  
  // Draw strata
  for (let stratum of strata) {
    fill(stratum.color);
    noStroke();
    rect(0, stratum.y, width, stratum.height);
  }
  
  time += 0.01;
  
  // Update and draw filaments
  for (let filament of filaments) {
    if (filament.age < filament.maxAge) {
      filament.age += filament.growthRate;
      
      // Add new segment
      if (frameCount % 2 === 0) {
        const angle = noise(filament.x * 0.01, filament.y * 0.01, time) * TWO_PI;
        const dx = cos(angle) * 2;
        const dy = sin(angle) * 2;
        
        filament.segments.push({
          x: filament.x,
          y: filament.y,
          size: map(filament.age, 0, filament.maxAge, 1, 3)
        });
        
        filament.x += dx;
        filament.y += dy;
        
        // Keep within canvas
        if (filament.x < 0) filament.x = 0;
        if (filament.x > width) filament.x = width;
        if (filament.y < 0) filament.y = 0;
        if (filament.y > height) filament.y = height;
      }
    }
    
    // Draw filament
    strokeWeight(1);
    stroke(filament.color);
    noFill();
    
    beginShape();
    for (let segment of filament.segments) {
      vertex(segment.x, segment.y);
    }
    endShape();
  }
}
