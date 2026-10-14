let photoURLs = [];
let photos = [];
let positions = [];
let speeds = [];
let rotationSpeeds = [];
let numCliffs = 200;

function preload() {
  for (let i = 0; i < numCliffs; i++) {
    let seed = "cliff" + i;
    photoURLs.push("https://picsum.photos/seed/" + seed + "/512/512");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  for (let i = 0; i < numCliffs; i++) {
    positions.push(createVector(random(-width * 2, width * 2), random(-height * 2, height * 2), random(-500, 500)));
    speeds.push(createVector(random(-0.02, 0.02), random(-0.02, 0.02), random(-0.02, 0.02)));
    rotationSpeeds.push(random(0.002, 0.008));
  }
  
  // Start loading images
  for (let i = 0; i < numCliffs; i++) {
    loadImage(photoURLs[i], (img) => {
      photos[i] = img;
    });
  }
}

function draw() {
  background(5, 5, 15);
  
  rotateY(frameCount * 0.001);
  
  for (let i = 0; i < numCliffs; i++) {
    let pos = positions[i].copy().add(speeds[i]).mult(100);
    let rotation = frameCount * rotationSpeeds[i];
    
    push();
    translate(pos.x, pos.y, pos.z);
    rotateX(rotation);
    rotateY(rotation * 0.5);
    rotateZ(rotation * 0.3);
    
    let w = random(20, 80);
    let h = random(100, 300);
    
    if (photos[i]) {
      image(photos[i], -w/2, -h/2, w, h);
    } else {
      // Placeholder while loading
      fill(100, 150, 200, 100);
      rect(-w/2, -h/2, w, h);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  for (let i = 0; i < numCliffs; i++) {
    positions[i] = createVector(random(-width * 2, width * 2), random(-height * 2, height * 2), random(-500, 500));
    speeds[i] = createVector(random(-0.02, 0.02), random(-0.02, 0.02), random(-0.02, 0.02));
  }
}
