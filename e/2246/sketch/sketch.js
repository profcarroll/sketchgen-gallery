let strata = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geological strata layers
  for (let i = 0; i < 8; i++) {
    let y = map(i, 0, 7, -200, 200);
    let height = random(15, 30);
    let hue = 20 + random(20); // Gray to earth tones
    let saturation = 10 + random(20);
    let brightness = 40 + random(30);
    
    strata.push({
      y: y,
      height: height,
      hue: hue,
      saturation: saturation,
      brightness: brightness,
      speed: random(0.001, 0.003),
      offset: random(TWO_PI)
    });
  }
  
  // Create particles representing sediment
  particles = new Array(1500).fill().map(() => ({
    x: random(-width/2, width/2),
    y: random(-height/2, height/2),
    z: random(-300, 300),
    size: random(0.5, 2),
    hue: 10 + random(20), // Gray tones
    saturation: 5 + random(10),
    brightness: 30 + random(40),
    speed: random(0.0005, 0.002),
    offset: random(TWO_PI),
    layer: floor(random(strata.length))
  }));
}

function draw() {
  background(0);
  
  // Slow rotation for the whole scene
  rotateY(frameCount * 0.0002);
  rotateX(frameCount * 0.0001);
  
  // Draw geological strata with counter-gravity movement
  for (let i = 0; i < strata.length; i++) {
    let layer = strata[i];
    
    push();
    translate(0, layer.y + sin(frameCount * layer.speed + layer.offset) * 20, 0);
    
    noStroke();
    fill(layer.hue, layer.saturation, layer.brightness, 0.8);
    
    // Draw the stratum as a horizontal plane with some texture
    beginShape();
    vertex(-width/2, -layer.height/2, 0);
    vertex(width/2, -layer.height/2, 0);
    vertex(width/2, layer.height/2, 0);
    vertex(-width/2, layer.height/2, 0);
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw sediment particles with counter-gravity motion
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Counter-gravity motion: some particles move upward, others downward
    let yoff = sin(frameCount * p.speed + p.offset) * 30;
    let zoff = cos(frameCount * p.speed * 0.7 + p.offset) * 15;
    let xoff = sin(frameCount * p.speed * 0.5 + p.offset) * 20;
    
    // Layer-based influence on movement
    let layerInfluence = strata[p.layer].speed * 100;
    
    vertex(p.x + xoff, 
           p.y + yoff + sin(frameCount * 0.003 + p.offset) * 5 + layerInfluence,
           p.z + zoff);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
