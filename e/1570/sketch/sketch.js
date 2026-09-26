let forms = [];
const NUM_FORMS = 100;
const GRAVITY = 0.05;
const DRIFT = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < NUM_FORMS; i++) {
    forms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 0),
      size: random(15, 60),
      speed: random(0.3, 1.5),
      hue: random(180, 300), // blue to violet range
      alpha: random(0.7, 1)
    });
  }
}

function draw() {
  background(0);

  for (let form of forms) {
    // Apply gravity and drift
    form.y += form.speed * GRAVITY;
    form.x += sin(frameCount * 0.01 + form.z * 0.001) * DRIFT;

    // Reset if out of bounds
    if (form.y > height/2 + 100) {
      form.y = -100;
      form.x = random(-width/2, width/2);
      form.z = random(-1000, 0);
    }

    push();
    translate(form.x, form.y, form.z);
    
    // Create a glowing, structured geometric form (a torus with subtle variation)
    noStroke();
    fill(form.hue, 100, 90, form.alpha);
    rotateX(frameCount * 0.005);
    rotateY(frameCount * 0.003);
    torus(form.size, form.size/4, 16, 8);
    
    // Add a secondary, smaller glowing element for complexity
    fill(form.hue, 100, 100, form.alpha * 0.5);
    sphere(form.size/3);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
