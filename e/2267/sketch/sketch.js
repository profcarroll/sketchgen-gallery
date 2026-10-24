let vents = [];
let pulseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geothermal vent formations using a grid-based approach for efficiency
  const gridSize = 80;
  const numVents = 25;
  
  for (let i = 0; i < numVents; i++) {
    let x = random(-width/2 + gridSize, width/2 - gridSize);
    let y = random(-height/2 + gridSize, height/2 - gridSize);
    let z = random(-100, 100);
    
    // Create a vent with multiple layers
    let layers = [];
    let numLayers = floor(random(3, 6));
    
    for (let j = 0; j < numLayers; j++) {
      let radius = random(20, 50);
      let height = random(40, 120);
      
      layers.push({
        x: x,
        y: y,
        z: z,
        radius: radius,
        height: height,
        phase: random(TWO_PI)
      });
    }
    
    vents.push({
      layers: layers
    });
  }
}

function draw() {
  background(20, 30, 5); // Deep dark background
  
  // Update pulse phase for rhythmic motion
  pulseOffset += 0.01;
  
  // Set up lighting
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(255, 255, 255, 0, height/2, 0);
  
  // Draw vent formations using batched geometry
  for (let vent of vents) {
    for (let layer of vent.layers) {
      // Apply pulsing effect to vent dimensions
      let pulse = sin(pulseOffset + layer.phase) * 0.15 + 0.92;
      
      let scaledRadius = layer.radius * pulse;
      let scaledHeight = layer.height * pulse;
      
      // Create a subtle color variation for mineral appearance
      let hue = map(layer.x, -width/2, width/2, 15, 35);
      let sat = map(layer.y, -height/2, height/2, 60, 80);
      let bri = map(layer.z, -100, 100, 10, 40);
      
      fill(hue, sat, bri, 0.9);
      noStroke();
      
      push();
      translate(layer.x, layer.y, layer.z);
      rotateX(PI/4);
      
      // Use a lower detail cylinder for performance
      cylinder(scaledRadius, scaledHeight, 6, 1, true);
      pop();
    }
  }
  
  // Add glowing heat effect to vents using batched spheres
  beginShape(POINTS);
  for (let vent of vents) {
    for (let layer of vent.layers) {
      let pulse = sin(pulseOffset + layer.phase) * 0.15 + 0.92;
      
      // Create a warm glow
      let glowRadius = layer.radius * 1.2 * pulse;
      let glowBrightness = map(pulse, 0.92, 1.07, 50, 100);
      
      fill(20, 80, glowBrightness, 0.3);
      
      // Use a single point to represent the glow
      let x = layer.x;
      let y = layer.y;
      let z = layer.z;
      
      vertex(x, y, z);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
