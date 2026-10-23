let mechanisms = [];
let isAnimating = false;
let cameraAngle = 0;
let orbitPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a central brass hub
  mechanisms.push({
    x: 0,
    y: 0,
    z: 0,
    radius: 20,
    hue: 40,
    brightness: 80,
    type: "hub"
  });

  // Build cantilevered clockwork sculptures with brass-like appearance
  const sculptureData = [
    { distance: 60, size: 15, hue: 35, speed: 0.02, rotationSpeed: 0.01, name: "Cantilever A" },
    { distance: 90, size: 12, hue: 45, speed: 0.015, rotationSpeed: 0.008, name: "Cantilever B" },
    { distance: 120, size: 10, hue: 55, speed: 0.01, rotationSpeed: 0.006, name: "Cantilever C" },
    { distance: 160, size: 8, hue: 65, speed: 0.008, rotationSpeed: 0.004, name: "Cantilever D" },
    { distance: 200, size: 6, hue: 75, speed: 0.006, rotationSpeed: 0.003, name: "Cantilever E" },
    { distance: 240, size: 5, hue: 85, speed: 0.005, rotationSpeed: 0.002, name: "Cantilever F" }
  ];

  for (let i = 0; i < sculptureData.length; i++) {
    const data = sculptureData[i];
    mechanisms.push({
      angle: random(TWO_PI),
      distance: data.distance,
      size: data.size,
      hue: data.hue,
      speed: data.speed,
      rotationSpeed: data.rotationSpeed,
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
      name: data.name,
      type: "cantilever"
    });
  }

  // Precompute orbit paths for visual effect
  for (let i = 0; i < 1000; i++) {
    const angle = map(i, 0, 1000, 0, TWO_PI * 5);
    const radius = 200 + sin(angle * 3) * 50;
    orbitPoints.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: sin(angle * 2) * 30
    });
  }

  // Initial animation state
  isAnimating = true;
}

function draw() {
  background(0);

  // Set up lighting to emphasize brass texture
  pointLight(255, 255, 255, 0, 0, 100);
  ambientLight(50);

  // Rotate camera slowly for better viewing
  cameraAngle += 0.001;
  rotateY(cameraAngle);

  // Draw brass hub
  push();
  fill(mechanisms[0].hue, 60, mechanisms[0].brightness);
  noStroke();
  sphere(mechanisms[0].radius);
  pop();

  if (isAnimating) {
    for (let i = 1; i < mechanisms.length; i++) {
      const mech = mechanisms[i];
      mech.angle += mech.speed;
      mech.rotation += mech.rotationSpeed;

      mech.x = cos(mech.angle) * mech.distance;
      mech.y = sin(mech.angle) * mech.distance;

      push();
      translate(mech.x, mech.y, 0);
      rotateY(mech.rotation);

      // Draw cantilevered structure with brass-like appearance
      fill(mech.hue, 70, 85);
      noStroke();

      if (mech.type === "cantilever") {
        // Create a simple cantilevered arm structure
        push();
        rotateX(PI/4); // Tilt the arm for 3D effect
        box(mech.size * 0.5, mech.size * 0.2, mech.size * 0.2);
        pop();

        // Add small brass gears at the ends
        push();
        translate(0, 0, mech.size * 0.2);
        sphere(mech.size * 0.15);
        pop();
      }

      pop();
    }
  }

  // Draw orbit paths for visual effect
  stroke(100, 30, 70, 0.3);
  noFill();
  beginShape();
  for (let i = 0; i < orbitPoints.length; i++) {
    const p = orbitPoints[i];
    vertex(p.x, p.y, p.z);
  }
  endShape(CLOSE);
}

function mousePressed() {
  if (!isAnimating) {
    isAnimating = true;
  }
}
