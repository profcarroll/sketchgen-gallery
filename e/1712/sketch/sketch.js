let jellyfish;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the jellyfish with segmented tendrils
  jellyfish = {
    bodyRadius: 150,
    segments: [],
    tendrils: []
  };
  
  // Create central body segments
  for (let i = 0; i < 8; i++) {
    jellyfish.segments.push({
      angle: i * TWO_PI / 8,
      radius: random(80, 120),
      length: random(30, 60),
      hue: random(180, 240),
      saturation: random(70, 90),
      brightness: random(80, 100)
    });
  }
  
  // Create tendrils with jagged segments
  for (let i = 0; i < 15; i++) {
    let tendrils = [];
    let count = floor(random(30, 60));
    for (let j = 0; j < count; j++) {
      tendrils.push({
        angle: random(TWO_PI),
        radius: random(100, 400),
        length: random(5, 20),
        hue: random(200, 300),
        saturation: random(80, 100),
        brightness: random(90, 100)
      });
    }
    jellyfish.tendrils.push(tendrils);
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Dark with slight fade
  time += 0.005;
  
  // Center the jellyfish
  translate(0, 0, -200);
  
  // Rotate slowly
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw body segments with jagged edges
  for (let i = 0; i < jellyfish.segments.length; i++) {
    let seg = jellyfish.segments[i];
    
    push();
    rotateZ(seg.angle + time * 0.5);
    translate(0, -seg.radius, 0);
    
    // Draw a jagged segment with sharp edges
    noStroke();
    fill(seg.hue, seg.saturation, seg.brightness, 0.7);
    
    beginShape();
    let points = 12;
    for (let j = 0; j < points; j++) {
      let angle = TWO_PI * j / points;
      let x = cos(angle) * seg.length;
      let y = sin(angle) * seg.length;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw tendrils with crystalline shards
  for (let i = 0; i < jellyfish.tendrils.length; i++) {
    let tendr = jellyfish.tendrils[i];
    
    push();
    rotateY(i * TWO_PI / jellyfish.tendrils.length + time * 0.3);
    
    // Draw each segment in the tendril
    for (let j = 0; j < tendr.length; j++) {
      let seg = tendr[j];
      
      translate(0, seg.radius, 0);
      
      // Draw a jagged shard
      noStroke();
      fill(seg.hue, seg.saturation, seg.brightness, 0.8);
      
      beginShape();
      let points = 6;
      for (let k = 0; k < points; k++) {
        let angle = TWO_PI * k / points + time * 2;
        let x = cos(angle) * seg.length;
        let y = sin(angle) * seg.length;
        vertex(x, y, 0);
      }
      endShape(CLOSE);
      
      // Move to next segment
      translate(0, -seg.radius, 0);
    }
    
    pop();
  }
  
  // Add floating light particles
  for (let i = 0; i < 50; i++) {
    let angle = time * 0.2 + i * 0.1;
    let radius = 300 + sin(time + i) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.3 + i) * 100;
    
    push();
    translate(x, y, z);
    
    noStroke();
    fill(240, 100, 100, 0.7);
    sphere(2);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
