let figures = [];
let lightSource = { x: 0, y: 0 };
let screen;

function setup() {
  createCanvas(800, 600);
  screen = createGraphics(width, height);
  
  // Create some stylized Indonesian silhouette figures
  for (let i = 0; i < 5; i++) {
    figures.push({
      x: random(100, width - 100),
      y: random(100, height - 100),
      w: random(40, 80),
      h: random(60, 120),
      rotation: random(TWO_PI),
      color: color(random(100, 200), random(50, 150), random(100, 200)),
      isDragging: false
    });
  }
  
  // Initialize light source
  lightSource.x = width / 2;
  lightSource.y = height / 3;
}

function draw() {
  background(20);
  
  // Animate the light source
  lightSource.x += sin(frameCount * 0.01) * 0.5;
  lightSource.y += cos(frameCount * 0.01) * 0.5;
  
  // Draw the backlit screen
  screen.background(20);
  screen.noStroke();
  
  // Draw shadows from figures
  for (let figure of figures) {
    let shadow = createGraphics(figure.w * 1.5, figure.h * 1.5);
    shadow.noStroke();
    
    // Draw figure shape on shadow
    shadow.fill(figure.color);
    shadow.rectMode(CENTER);
    shadow.translate(shadow.width / 2, shadow.height / 2);
    shadow.rotate(figure.rotation);
    shadow.rect(0, 0, figure.w, figure.h);
    
    // Calculate shadow position based on light source
    let dx = figure.x - lightSource.x;
    let dy = figure.y - lightSource.y;
    let dist = sqrt(dx * dx + dy * dy);
    let scale = map(dist, 0, width, 1.5, 0.3);
    
    screen.image(shadow, figure.x - shadow.width / 2, figure.y - shadow.height / 2, shadow.width * scale, shadow.height * scale);
  }
  
  // Display the screen
  image(screen, 0, 0);
  
  // Draw interactive figures
  for (let figure of figures) {
    fill(figure.color);
    noStroke();
    rectMode(CENTER);
    push();
    translate(figure.x, figure.y);
    rotate(figure.rotation);
    rect(0, 0, figure.w, figure.h);
    pop();
  }
}

function mousePressed() {
  for (let figure of figures) {
    let d = dist(mouseX, mouseY, figure.x, figure.y);
    if (d < max(figure.w, figure.h) / 2) {
      figure.isDragging = true;
      break;
    }
  }
}

function mouseReleased() {
  for (let figure of figures) {
    figure.isDragging = false;
  }
}

function mouseDragged() {
  for (let figure of figures) {
    if (figure.isDragging) {
      figure.x = mouseX;
      figure.y = mouseY;
      break;
    }
  }
}
