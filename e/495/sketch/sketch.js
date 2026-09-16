let titles = [
  "CINEMATIC",
  "TITLES",
  "EMERGE",
  "FROM",
  "DEPTH"
];
let chars = [];
let cameraZ = 0;
let targetCameraZ = 0;
let cameraSpeed = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textAlign(CENTER, CENTER);
  textSize(80);
  textFont('Arial');
  
  // Precompute characters for each title
  for (let i = 0; i < titles.length; i++) {
    let title = titles[i];
    let titleChars = [];
    for (let j = 0; j < title.length; j++) {
      let c = title.charAt(j);
      let charObj = {
        letter: c,
        x: 0,
        y: 0,
        z: 0,
        size: 80,
        opacity: 0
      };
      titleChars.push(charObj);
    }
    chars.push(titleChars);
  }
}

function draw() {
  background(0);
  
  // Camera movement
  cameraZ += (targetCameraZ - cameraZ) * cameraSpeed;
  if (abs(targetCameraZ - cameraZ) < 0.001) {
    targetCameraZ = random(-500, 500);
  }
  
  // Camera position
  perspective(PI/3, width/height, 0.1, 2000);
  translate(0, 0, cameraZ);
  
  // Lighting
  pointLight(255, 255, 255, 0, -200, 300);
  pointLight(255, 200, 100, 0, 200, -300);
  
  // Draw titles
  for (let i = 0; i < chars.length; i++) {
    let titleChars = chars[i];
    let offsetX = -(titleChars.length * 40);
    
    for (let j = 0; j < titleChars.length; j++) {
      let charObj = titleChars[j];
      
      // Position in 3D space
      charObj.x = offsetX + j * 80;
      charObj.y = sin(frameCount * 0.01 + i) * 20;
      charObj.z = -i * 150; // Depth
      charObj.opacity = map(dist(charObj.x, charObj.y, charObj.z, 0, 0, 0), 
                             300, 1000, 0, 255);
      
      push();
      translate(charObj.x, charObj.y, charObj.z);
      rotateY(frameCount * 0.005 + i * 0.5);
      rotateX(sin(frameCount * 0.003 + j) * 0.1);
      
      // Glow effect
      fill(255, 255, 255, charObj.opacity);
      stroke(255, 200, 100, charObj.opacity);
      strokeWeight(2);
      
      text(charObj.letter, 0, 0);
      
      // Add glow
      noStroke();
      fill(255, 150, 50, 30);
      sphere(45);
      
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
