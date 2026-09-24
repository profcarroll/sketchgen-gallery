let jug, candlesticks, fruitPlatter;
let lightSource;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Define objects
  jug = new Jug(0, -30, 0, 80, 120);
  candlesticks = new Candlesticks(-100, 0, 0, 60, 40);
  fruitPlatter = new FruitPlatter(100, 0, 0, 100);
  
  // Light source positioned to create dramatic shadows
  lightSource = {
    x: -200,
    y: 300,
    z: -200
  };
}

function draw() {
  background(20);
  
  // Ambient lighting
  ambientLight(40);
  
  // Directional light for dramatic shadows
  directionalLight(255, 255, 255, 
                   lightSource.x, lightSource.y, lightSource.z);
  
  // Draw scene components
  jug.display();
  candlesticks.display();
  fruitPlatter.display();
}

class Jug {
  constructor(x, y, z, diameter, height) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.diameter = diameter;
    this.height = height;
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    
    // Transparent water jug
    fill(200, 230, 255, 180);
    stroke(180, 200, 220);
    strokeWeight(1);
    cylinder(this.diameter/2, this.height, 16, 1);
    
    // Jug base
    fill(139, 69, 19);
    noStroke();
    translate(0, this.height/2, 0);
    cylinder(this.diameter/2, 5, 16, 1);
    
    pop();
  }
}

class Candlesticks {
  constructor(x, y, z, width, height) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    
    // Silver candlesticks
    fill(200, 200, 200);
    stroke(150, 150, 150);
    strokeWeight(1);
    
    // Base
    push();
    translate(-this.width/4, this.height/2, 0);
    box(this.width/2, 10, 10);
    pop();
    
    // Column
    push();
    translate(0, -this.height/2 + 5, 0);
    cylinder(this.width/8, this.height - 10, 16, 1);
    pop();
    
    // Candle flame
    fill(255, 200, 0);
    noStroke();
    push();
    translate(0, -this.height/2 + 10, 0);
    sphere(5);
    pop();
    
    pop();
  }
}

class FruitPlatter {
  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.fruits = [];
    this.setupFruits();
  }
  
  setupFruits() {
    // Create colorful fruits
    const colors = [
      [255, 0, 0],    // Red
      [255, 165, 0],  // Orange
      [255, 255, 0],  // Yellow
      [0, 255, 0],    // Green
      [0, 0, 255],    // Blue
      [138, 43, 226]  // Purple
    ];
    
    for (let i = 0; i < 6; i++) {
      const angle = map(i, 0, 6, 0, TWO_PI);
      const radius = this.size * 0.3;
      const x = cos(angle) * radius;
      const z = sin(angle) * radius;
      
      // Random fruit type (sphere or box)
      const isSphere = random() > 0.5;
      
      this.fruits.push({
        x: x,
        y: -this.size/4 + random(-20, 20),
        z: z,
        size: random(10, 20),
        color: colors[i],
        isSphere: isSphere
      });
    }
    
    // Platter base
    this.platterBase = {
      x: 0,
      y: -this.size/4,
      z: 0,
      width: this.size * 1.2,
      height: 5
    };
  }
  
  display() {
    push();
    translate(this.x, this.y, this.z);
    
    // Platter base
    fill(139, 69, 19);
    noStroke();
    box(this.platterBase.width, this.platterBase.height, this.platterBase.width);
    
    // Fruits
    for (let fruit of this.fruits) {
      push();
      translate(fruit.x, fruit.y, fruit.z);
      
      fill(fruit.color[0], fruit.color[1], fruit.color[2]);
      noStroke();
      
      if (fruit.isSphere) {
        sphere(fruit.size);
      } else {
        box(fruit.size, fruit.size, fruit.size);
      }
      
      pop();
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
