function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Scene objects - fixed positions
  jug = {
    x: -150,
    y: 0,
    z: 0,
    radius: 60,
    height: 120
  };
  
  candlesticks = [
    { x: 100, y: 0, z: -50, height: 80, baseRadius: 20 },
    { x: 150, y: 0, z: 0, height: 80, baseRadius: 20 }
  ];
  
  platter = {
    x: 0,
    y: 0,
    z: 50,
    radius: 100
  };
  
  fruits = [];
  for (let i = 0; i < 15; i++) {
    fruits.push({
      x: random(-platter.radius/2, platter.radius/2),
      y: 0,
      z: random(-platter.radius/2, platter.radius/2),
      radius: random(8, 15)
    });
  }
  
  // Candle that emits light
  candle = {
    x: 100,
    y: -40,
    z: -50,
    radius: 10,
    height: 60
  };
  
  // Build static geometry for performance
  buildJugGeometry();
  buildCandlestickGeometry();
  buildPlatterGeometry();
  buildFruitGeometry();
  buildCandleGeometry();
}

function draw() {
  background(20, 10, 5);
  
  // Ambient light
  ambientLight(20);
  
  // Main light source from above
  pointLight(255, 255, 255, 0, -300, 200);
  
  // Light from the glowing candle
  pointLight(255, 180, 100, candle.x, candle.y, candle.z);
  
  // Rotate scene slowly for viewing angle
  rotateY(frameCount * 0.002);
  
  // Tabletop (dark brown)
  push();
  translate(0, 200, 0);
  rotateX(PI / 2);
  fill(20, 30, 20);
  plane(600, 400);
  pop();
  
  // Water jug
  push();
  translate(jug.x, jug.y, jug.z);
  fill(180, 50, 90); // Clear blue
  drawJug();
  pop();
  
  // Candlesticks
  for (let stick of candlesticks) {
    push();
    translate(stick.x, stick.y, stick.z);
    
    // Base
    fill(20, 5, 70); // Dark silver
    drawCandlestickBase();
    
    // Stem
    translate(0, 10, 0);
    fill(30, 10, 80); // Lighter silver
    drawCandlestickStem();
    
    pop();
  }
  
  // Platter
  push();
  translate(platter.x, platter.y, platter.z);
  fill(20, 20, 60); // Dark brown
  drawPlatter();
  pop();
  
  // Fruit on platter
  for (let fruit of fruits) {
    push();
    translate(platter.x + fruit.x, platter.y, platter.z + fruit.z);
    fill(20, 80, 90); // Red
    drawFruit();
    pop();
  }
  
  // Glowing candle
  push();
  translate(candle.x, candle.y, candle.z);
  fill(25, 100, 100); // Bright yellow-orange
  drawCandle();
  pop();
}

// Geometry building functions for performance
function buildJugGeometry() {
  jug.geometry = [];
  const detail = 12;
  for (let i = 0; i < detail; i++) {
    const angle = TWO_PI * i / detail;
    jug.geometry.push({
      x: cos(angle) * jug.radius,
      z: sin(angle) * jug.radius
    });
  }
}

function buildCandlestickGeometry() {
  candlesticks[0].baseGeometry = [];
  candlesticks[1].baseGeometry = [];
  const detail = 12;
  
  for (let i = 0; i < detail; i++) {
    const angle = TWO_PI * i / detail;
    const x = cos(angle) * candlesticks[0].baseRadius;
    const z = sin(angle) * candlesticks[0].baseRadius;
    candlesticks[0].baseGeometry.push({x, z});
    candlesticks[1].baseGeometry.push({x, z});
  }
}

function buildPlatterGeometry() {
  platter.geometry = [];
  const detail = 12;
  for (let i = 0; i < detail; i++) {
    const angle = TWO_PI * i / detail;
    platter.geometry.push({
      x: cos(angle) * platter.radius,
      z: sin(angle) * platter.radius
    });
  }
}

function buildFruitGeometry() {
  for (let fruit of fruits) {
    fruit.geometry = [];
    const detail = 6;
    for (let i = 0; i < detail; i++) {
      const angle1 = PI * i / detail;
      for (let j = 0; j < detail; j++) {
        const angle2 = TWO_PI * j / detail;
        fruit.geometry.push({
          x: cos(angle1) * sin(angle2) * fruit.radius,
          y: sin(angle1) * fruit.radius,
          z: cos(angle1) * cos(angle2) * fruit.radius
        });
      }
    }
  }
}

function buildCandleGeometry() {
  candle.geometry = [];
  const detail = 8;
  for (let i = 0; i < detail; i++) {
    const angle = TWO_PI * i / detail;
    candle.geometry.push({
      x: cos(angle) * candle.radius,
      z: sin(angle) * candle.radius
    });
  }
}

function drawJug() {
  beginShape(QUAD_STRIP);
  for (let i = 0; i < jug.geometry.length; i++) {
    const p1 = jug.geometry[i];
    const p2 = jug.geometry[(i + 1) % jug.geometry.length];
    
    vertex(p1.x, -jug.height/2, p1.z);
    vertex(p2.x, -jug.height/2, p2.z);
    
    vertex(p1.x, jug.height/2, p1.z);
    vertex(p2.x, jug.height/2, p2.z);
  }
  endShape();
}

function drawCandlestickBase() {
  beginShape(CLOSE);
  for (let p of candlesticks[0].baseGeometry) {
    vertex(p.x, 0, p.z);
  }
  endShape();
}

function drawCandlestickStem() {
  beginShape(QUAD_STRIP);
  for (let i = 0; i < 2; i++) {
    const angle = TWO_PI * i / 2;
    const x = cos(angle) * 5;
    const z = sin(angle) * 5;
    
    vertex(x, -candlesticks[0].height + 10, z);
    vertex(x, 0, z);
  }
  endShape();
}

function drawPlatter() {
  beginShape(CLOSE);
  for (let p of platter.geometry) {
    vertex(p.x, 0, p.z);
  }
  endShape();
}

function drawFruit() {
  beginShape(POINTS);
  for (let p of fruits[0].geometry) {
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function drawCandle() {
  beginShape(CLOSE);
  for (let p of candle.geometry) {
    vertex(p.x, 0, p.z);
  }
  endShape();
}
