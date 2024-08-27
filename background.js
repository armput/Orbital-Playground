let dots = []

class Dot {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.vel = createVector(random(-0.1, 0.1), random(-0.1, 0.1));

		dots.push(this);
	}

	drawLine(body) {
		let distance = dist(this.pos.x, this.pos.y, body.pos.x, body.pos.y);
		let alpha = map(distance, 200, 50, 10, 255);

		stroke(50, alpha);
		strokeWeight(1);
		line(this.pos.x, this.pos.y, body.pos.x, body.pos.y);
	}
	
	show() {
		stroke(50);
		strokeWeight(3);
		point(this.pos.x, this.pos.y);
	}

	update() {
		this.pos.add(this.vel);

		if (this.pos.x < 0) {
			this.pos.x = width;
		}
		if (this.pos.x > width) {
			this.pos.x = 0;
		}
		if (this.pos.y < 0) {
			this.pos.y = height;
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
		}

		this.show();
	}
}
