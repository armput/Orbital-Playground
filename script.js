function setup() {
  createCanvas(windowWidth, windowHeight);
	noCursor();

	let dotCount = floor((width * height) / 10000);
	for (let i = 0; i < dotCount; i++) {
		new Dot(random(width), random(height));
	}
}

function draw() {
	background(0, 0, 13);

	dots.forEach(dot => {
		dot.update();
		bodies.forEach(body => {
			dot.drawLine(body);
		})
	})
	
	for (let self of bodies) {
		for (let other of bodies) {
			if (self !== other) {
				if (other.isFrozen === false) {
					other.applyForce(self.attract(other));
				}
				self.collide(other);
			}
		}
		
		self.update();
	}

	stroke(255);
	strokeWeight(5);
	point(mouseX, mouseY);

	fill(255);
	noStroke();
	textAlign(LEFT, TOP);
	text(clickMode, 0, 0);
	text(creationMode, 0, 10);
	
	if (debug) {
		textAlign(RIGHT, TOP);
		text('fps: ' + floor(frameRate()), width, 0);
		
		text('bodies: ' + bodies.length, width, 20);
		text('particles: ' + particles.length, width, 30);
		text('stars: ' + stars.length, width, 40);
		text('blackHoles: ' + blackHoles.length, width, 50);
		text('whiteHoles: ' + whiteHoles.length, width, 60);
		text('wormHoles: ' + wormHoles.length, width, 70);
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
