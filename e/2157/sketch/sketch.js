let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a complex metallic structure with interconnected components
  for (let i = 0; i < 25; i++) {
    let component = {
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-300, 300),
      size: random(20, 80),
      angle: random(TWO_PI),
      originalAngle: random(TWO_PI),
      type: i % 3, // 0 = plate, 1 = piston, 2 = pump
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    };
    structures.push(component);
  }
}

function draw() {
  background(30, 20, 15);
  
  // Slowly rotate the entire structure
  rotateY(time * 0.0005);
  rotateX(sin(time * 0.0002) * 0.05);
  
  // Update time for animation
  time++;
  
  // Draw each structural component
  for (let i = 0; i < structures.length; i++) {
    let comp = structures[i];
    
    push();
    
    translate(comp.x, comp.y, comp.z);
    
    // Apply cyclical movement - pistons push and retract
    let move = sin(time * comp.speed + comp.phase) * 20;
    
    if (comp.type === 1) { // Piston
      translate(0, move, 0);
      rotateX(PI/2);
      fill(100, 80, 60);
      cylinder(comp.size * 0.5, comp.size * 2);
    } else if (comp.type === 2) { // Pump
      fill(120, 90, 70);
      sphere(comp.size * 0.8);
      
      // Add some internal structure
      push();
      rotateX(PI/4);
      fill(90, 70, 50);
      box(comp.size * 0.6, comp.size * 0.2, comp.size * 0.6);
      pop();
    } else { // Plate
      let scaleValue = 1 + sin(time * comp.speed + comp.phase) * 0.1;
      scale(scaleValue, scaleValue, scaleValue);
      
      rotateZ(comp.originalAngle + sin(time * 0.002 + i) * 0.2);
      
      fill(150, 120, 100);
      plane(comp.size, comp.size * 0.3);
    }
    
    pop();
  }
  
  // Add subtle rust-like particles to emphasize oxidation
  for (let i = 0; i < 100; i++) {
    let x = sin(time * 0.001 + i) * 300;
    let y = cos(time * 0.001 + i) * 300;
    let z = sin(time * 0.0005 + i) * 200;
    
    push();
    translate(x, y, z);
    fill(80, 40, 20, 150);
    sphere(1);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
