let fields = [];
let sculpturalForms = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create luminous fields
  for (let i = 0; i < 5; i++) {
    fields.push({
      speed: random(0.002, 0.005),
      scale: random(0.5, 1.5),
      hue: random(180, 240)
    });
  }

  // Create sculptural forms
  for (let i = 0; i < 8; i++) {
    sculpturalForms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(30, 80),
      intensity: random(0.5, 1),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5);

  time += 0.01;

  // Draw luminous fields
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    push();
    noStroke();
    fill(field.hue, 80, 90, 0.2);
    translate(0, 0, -100);
    rotateX(time * field.speed);
    rotateY(time * field.speed * 0.5);
    sphere(width * 0.3 * field.scale, 32, 32);
    pop();
  }

  // Draw sculptural forms
  for (let i = 0; i < sculpturalForms.length; i++) {
    let form = sculpturalForms[i];
    let d = dist(mouseX - width/2, mouseY - height/2, form.x, form.y);
    let intensity = map(d, 0, 300, form.intensity * 1.5, 0);
    intensity = constrain(intensity, 0, 1);

    push();
    translate(form.x, form.y, form.z);
    rotateX(time * 0.5);
    rotateY(time * 0.3);
    
    fill(200, 90, 100 + intensity * 40, 0.8);
    noStroke();
    
    // Create a complex shape with depth
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      let x = cos(a) * form.size;
      let y = sin(a) * form.size;
      let z = sin(time + a) * form.size * 0.5;
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    // Add inner glow
    fill(180, 70, 100, 0.3);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      let x = cos(a) * form.size * 0.6;
      let y = sin(a) * form.size * 0.6;
      let z = sin(time + a) * form.size * 0.3;
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    pop();
  }
}
