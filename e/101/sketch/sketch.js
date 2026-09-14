let satellites = [];
let earth;

function setup() {
  createCanvas(800, 600, WEBGL);
  earth = new Earth();
  
  for (let i = 0; i < 300; i++) {
    satellites.push(new Satellite());
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Ambient lighting
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 100);
  
  // Rotate the entire scene slowly
  rotateY(frameCount * 0.002);
  
  earth.display();
  
  for (let s of satellites) {
    s.update();
    s.display();
  }
}

class Earth {
  constructor() {
    this.radius = 100;
    this.rotationSpeed = 0.001;
    this.angle = 0;
  }
  
  display() {
    push();
    rotateY(this.angle);
    noStroke();
    
    // Create a textured sphere with blue and green hues
    sphere(this.radius);
    
    pop();
  }
  
  update() {
    this.angle += this.rotationSpeed;
  }
}

class Satellite {
  constructor() {
    this.radius = 100;
    this.distance = random(120, 250);
    this.angle = random(TWO_PI);
    this.speed = random(0.001, 0.005);
    this.size = random(1, 3);
    this.color = color(random(200, 255), random(100, 200), random(200, 255));
  }
  
  update() {
    this.angle += this.speed;
  }
  
  display() {
    push();
    
    // Position satellite in orbit
    let x = cos(this.angle) * this.distance;
    let y = sin(this.angle) * this.distance;
    let z = sin(this.angle * 0.5) * 30;
    
    translate(x, y, z);
    
    noStroke();
    fill(this.color);
    sphere(this.size);
    
    pop();
  }
}
