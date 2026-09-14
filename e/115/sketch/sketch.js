let time = 0;
let layers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize layers with different properties for complexity
  for (let i = 0; i < 15; i++) {
    layers.push({
      speed: random(0.001, 0.005),
      angleOffset: random(TWO_PI),
      radius: random(200, 400),
      hue: random(360)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw kaleidoscopic patterns
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    push();
    translate(width/2, height/2);
    
    // Rotate based on time and layer properties
    rotate(time * layer.speed + layer.angleOffset);
    
    // Draw multiple segments in a radial pattern
    for (let j = 0; j < 12; j++) {
      let angle = TWO_PI / 12 * j;
      
      // Create organic curve paths
      beginShape();
      for (let k = 0; k < 50; k++) {
        let a = angle + map(k, 0, 49, 0, PI/3);
        let r = layer.radius + sin(time * 2 + a * 3) * 50;
        let x = r * cos(a);
        let y = r * sin(a);
        
        // Add some noise for organic motion
        x += noise(time * 0.5 + k * 0.1) * 20;
        y += noise(time * 0.3 + k * 0.15) * 20;
        
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw sharp geometric segments
      stroke(layer.hue + i * 20, 80, 90, 150);
      strokeWeight(2);
      noFill();
      
      beginShape();
      for (let k = 0; k < 20; k++) {
        let a = angle + map(k, 0, 19, 0, PI/4);
        let r = layer.radius + sin(time * 3 + a * 5) * 30;
        let x = r * cos(a);
        let y = r * sin(a);
        
        vertex(x, y);
      }
      endShape();
    }
    
    pop();
    
    // Update hue for color cycling
    layer.hue = (layer.hue + 0.5) % 360;
  }
  
  // Add central swirling motion
  push();
  translate(width/2, height/2);
  stroke(255, 100);
  noFill();
  strokeWeight(1);
  
  for (let i = 0; i < 10; i++) {
    let r = 50 + sin(time * 2 + i) * 30;
    let angle = time + i * 0.5;
    
    beginShape();
    for (let j = 0; j < 100; j++) {
      let a = map(j, 0, 99, 0, TWO_PI);
      let x = r * cos(a + angle);
      let y = r * sin(a + angle);
      
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
