// sketch.js

let candle, jug, fruitPlatter;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
}

function draw() {
  background(10, 10, 20);

  // Ambient lighting
  ambientLight(40);

  // Directional light for dramatic contrast
  directionalLight(255, 255, 255, -1, -1, -1);

  // Table
  push();
  translate(0, 300, 0);
  rotateX(HALF_PI);
  fill(139, 69, 19); // Brown table
  plane(1000, 1000);
  pop();

  // Water jug
  push();
  translate(-200, 150, 0);
  rotateY(0.2);
  candle = new Candle(0, 0, 0, 20, 80);
  candle.display();
  pop();

  // Candelabra
  push();
  translate(200, 100, 0);
  rotateY(-0.3);
  let candelabra = new Candelabra(0, 0, 0, 150);
  candelabra.display();
  pop();

  // Fruit platter
  push();
  translate(0, 200, -100);
  rotateY(-0.1);
  let fruitPlatter = new FruitPlatter(0, 0, 0, 180);
  fruitPlatter.display();
  pop();
}

class Candle {
  constructor(x, y, z, radius, height) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
    this.height = height;
  }

  display() {
    // Candle body
    push();
    translate(this.x, this.y - this.height / 2, this.z);
    fill(200); // Silver
    cylinder(this.radius, this.height);
    pop();

    // Wick and flame
    push();
    translate(this.x, this.y - this.height / 2 + this.height, this.z);
    rotateX(PI / 2);
    fill(255, 150, 0); // Orange
    cone(3, 15);
    pop();

    // Light source for flame
    pointLight(255, 150, 0, this.x, this.y - this.height / 2 + this.height, this.z);
  }
}

class Candelabra {
  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
  }

  display() {
    // Base
    push();
    translate(this.x, this.y, this.z);
    fill(180); // Silver base
    sphere(this.size * 0.2);
    pop();

    // Arms
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      push();
      translate(
        this.x + cos(angle) * this.size * 0.4,
        this.y,
        this.z + sin(angle) * this.size * 0.4
      );
      rotateY(angle);
      rotateX(PI / 2);
      fill(180); // Silver arm
      cylinder(this.size * 0.05, this.size * 0.3);
      pop();
    }

    // Candle in center
    push();
    translate(this.x, this.y - this.size * 0.1, this.z);
    let candle = new Candle(0, 0, 0, 8, 30);
    candle.display();
    pop();
  }
}

class FruitPlatter {
  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
  }

  display() {
    // Platter base
    push();
    translate(this.x, this.y, this.z);
    fill(100); // Gray platter
    cylinder(this.size * 0.4, 10);
    pop();

    // Fruits
    let fruits = [
      { x: -30, y: 0, z: 0, color: [255, 0, 0], size: 15 }, // Red apple
      { x: 40, y: 0, z: 0, color: [255, 255, 0], size: 18 }, // Yellow lemon
      { x: 0, y: 0, z: -35, color: [255, 140, 0], size: 16 }, // Orange
      { x: 0, y: 0, z: 35, color: [138, 43, 226], size: 14 }, // Purple grape
    ];

    for (let fruit of fruits) {
      push();
      translate(this.x + fruit.x, this.y - 5, this.z + fruit.z);
      fill(fruit.color[0], fruit.color[1], fruit.color[2]);
      sphere(fruit.size);
      pop();
    }
  }
}
