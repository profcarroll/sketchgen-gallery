let ships = [];
let waterColor;
let shipColor;

function setup() {
  createCanvas(800, 600);
  waterColor = color(30, 60, 90);
  shipColor = color(220, 220, 220, 180);
  
  // Create initial ships near center
  for (let i = 0; i < 20; i++) {
    ships.push({
      x: width/2 + random(-50, 50),
      y: height/2 + random(-50, 50),
      size: random(10, 20),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      angle: random(TWO_PI),
      angleSpeed: random(-0.02, 0.02),
      life: 1,
      dissolving: false
    });
  }
}

function draw() {
  background(waterColor);
  
  // Draw water surface with subtle wave effect
  noStroke();
  for (let i = 0; i < 20; i++) {
    let y = height/2 + sin(frameCount * 0.01 + i) * 5;
    fill(40, 70, 100, 30);
    rect(0, y, width, 10);
  }
  
  // Update and draw ships
  for (let i = ships.length - 1; i >= 0; i--) {
    let ship = ships[i];
    
    if (ship.dissolving) {
      ship.life -= 0.01;
      if (ship.life <= 0) {
        ships.splice(i, 1);
        continue;
      }
    } else {
      // Apply gentle random movement
      ship.speedX += random(-0.01, 0.01);
      ship.speedY += random(-0.01, 0.01);
      
      // Clamp speed
      ship.speedX = constrain(ship.speedX, -0.5, 0.5);
      ship.speedY = constrain(ship.speedY, -0.5, 0.5);
      
      // Update position
      ship.x += ship.speedX;
      ship.y += ship.speedY;
      
      // Update rotation
      ship.angle += ship.angleSpeed;
    }
    
    // Draw ship as a paper-cut silhouette
    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);
    
    fill(shipColor);
    noStroke();
    
    // Simple ship shape (paper cut style)
    beginShape();
    vertex(0, -ship.size/2);
    vertex(ship.size/2, 0);
    vertex(0, ship.size/2);
    vertex(-ship.size/2, 0);
    endShape(CLOSE);
    
    // Add small sail
    fill(240, 240, 240, 150);
    rect(-2, -ship.size/2, 4, ship.size/2);
    
    pop();
  }
  
  // Draw particles when ships are dissolving
  for (let i = ships.length - 1; i >= 0; i--) {
    if (ships[i].dissolving && random() < 0.3) {
      fill(255, 255, 255, 100);
      noStroke();
      ellipse(
        ships[i].x + random(-5, 5),
        ships[i].y + random(-5, 5),
        random(1, 3)
      );
    }
  }
}

function mousePressed() {
  // Accelerate all ships when clicked
  for (let ship of ships) {
    ship.dissolving = true;
  }
}
