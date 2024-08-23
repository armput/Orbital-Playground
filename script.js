let colorlist = ['gold', 'yellow', 'turquoise', 'red']

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(255);

	bodies.forEach(body => {
		body.update();
	});
}

function mousePressed() {
	new Particle(mouseX, mouseY);
}
