let debug = false;

let bodies = [];
let particles = [];
let stars = [];
let blackHoles = [];
let whiteHoles = [];
let wormholes = [];

class Body {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);

		this.mass = 0;
		this.maxMass = 1;
		this.r = sqrt(this.mass) * 5;

		this.isSolid = true;
		this.isFrozen = false;

		bodies.push(this);
	}

	destroy() {
		bodies.splice(bodies.indexOf(this), 1);
	}

	evolve() {}

	applyForce(force) {
		let _force = p5.Vector.div(force, this.mass);
		this.acc.add(_force);
	}

	attract(other) {
		let force = p5.Vector.sub(this.pos, other.pos);
		
		let distance = force.mag();
		distance = constrain(distance, 0, 25);
		
		let strength = (other.mass * this.mass) / (distance * distance);
		
		force.setMag(strength);

		return(force);
	}

	collide(other) {
		let impactVec = p5.Vector.sub(this.pos, other.pos);
		let distance = impactVec.mag();

		if (distance <= this.r) {
			let overlap = distance - this.r;
			let dir = impactVec.copy();
			
			dir.setMag(overlap * 0.5);

			this.pos.add(dir);
			other.pos.sub(dir);

			distance = this.r + other.r;
			impactVec.setMag(distance);

			let sumMass = this.mass + other.mass;
			let velDiff = p5.Vector.sub(other.vel, this.vel);

			let num = velDiff.dot(impactVec);
			let den = sumMass * distance * distance;
			
			let deltaVel = p5.Vector.mult(impactVec, 2 * other.mass *(num / den));

			if (this.mass >= other.mass && other.isFrozen === false) {
				this.mass += other.mass;

				if (this.isSolid === true) {
					this.vel.add(deltaVel);
				}
				
				other.destroy();
			}
		}
	}

	show(textColor) {
		if (debug) {
			textAlign(CENTER, CENTER);
			fill(textColor);
			text(this.mass, this.pos.x, this.pos.y);

			stroke(255, 0, 0);
			strokeWeight(1);
			line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 50, this.pos.y + this.vel.y * 50);
		}
	}

	update() {		
		if (!this.isFrozen) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}

		if (this.pos.x < this.r || this.pos.x > width - this.r) {
			this.vel.x *= -1;
		} if (this.pos.y < this.r || this.pos.y > height - this.r) {
			this.vel.y *= -1;
		}

		this.evolve();
		this.show();
	}
}

function getColor() {
	let colors = [
		color(70, 42, 40),
		color(100, 43, 46),
		color(58, 46, 46)
	]

	return colors[int(random(colors.length))];
}

class Particle extends Body {
	constructor(x, y) {
		super(x, y);
		this.color = getColor();
		this.mass = 1;
		this.maxMass = 20;
		particles.push(this);
	}

	destroy() {
		super.destroy();
		particles.splice(particles.indexOf(this), 1);
	}

	evolve() {
		if (this.mass >= this.maxMass) {
			new Star(this.pos.x, this.pos.y, this.mass);
			this.destroy();
		}
	}
	
	show() {		
		noStroke();
		fill(this.color);
		circle(this.pos.x, this.pos.y, this.r * 2);
		super.show(255);
	}

	update() {
		this.r = sqrt(this.mass) * 5;
		super.update();
	}
}

class Star extends Body {
	constructor(x, y, mass, frozen) {
		super(x, y);
		
		if (mass === undefined) {
			this.mass = 20;
		} else {
			this.mass = mass;
		}

		if (frozen === true) {
			this.isFrozen = true;
		}
		
		this.maxMass = 120;
		this.stage = floor(this.mass / 20);
		stars.push(this);
	}

	destroy() {
		super.destroy();
		stars.splice(stars.indexOf(this), 1);
	}

	evolve() {
		if (this.mass >= this.maxMass) {
			new BlackHole(this.pos.x, this.pos.y, this.mass);
			this.destroy();
		}
	}

	show() {
		noStroke();

		if (this.stage == 1) {
			fill(255, 200, 0, random(80, 120));
			circle(this.pos.x, this.pos.y, (this.r * 2) + 7);

			fill(255, 200, 0);
			circle(this.pos.x, this.pos.y, this.r * 2);
		}
		
		if (this.stage == 2) {
			fill(255, 100, 0, random(120, 170));
			circle(this.pos.x, this.pos.y, (this.r * 2) + 8);

			fill(255, 255, 100);
			circle(this.pos.x, this.pos.y, this.r * 2);

			fill(255, 200, 0);
			circle(this.pos.x, this.pos.y, (this.r * 2) - 7);
		}
		
		if (this.stage == 3) {
			fill(255, 100, 0, random(120, 170));
			circle(this.pos.x, this.pos.y, (this.r * 2) + 8);

			fill(255, 220, 80);
			circle(this.pos.x, this.pos.y, this.r * 2);

			fill(255, 120, 0);
			circle(this.pos.x, this.pos.y, (this.r * 2) - 8);
		}

		if (this.stage == 4) {
			fill(255, 100, 0, random(120, 170));
			circle(this.pos.x, this.pos.y, (this.r * 2) + 8);

			fill(255, 100, 0);
			circle(this.pos.x, this.pos.y, this.r * 2);

			fill(255, 50, 0);
			circle(this.pos.x, this.pos.y, (this.r * 2) - 8);
		}
		
		if (this.stage == 5) {
			fill(80, 175, 255, random(120, 180));
			circle(this.pos.x, this.pos.y, (this.r * 2) + 8)

			fill(255);
			circle(this.pos.x, this.pos.y, this.r * 2);

			fill(175, 210, 255);
			circle(this.pos.x, this.pos.y, (this.r * 2) - 7);
		}

		super.show(0);
	}

	update() {
		if (this.stage == 5) {
			this.r = sqrt(this.mass) * 1.75;
		} else {
			this.r = sqrt(this.mass) * 3;
		}
		this.stage = floor(this.mass / 20);
		super.update();
	}
}

class BlackHole extends Body {
	constructor(x, y, mass, frozen) {
		super(x, y);
		
		if (mass === undefined) {
			this.mass = 120;
		} else {
			this.mass = mass;
		}

		if (frozen === true) {
			this.isFrozen = true;
		}
		
		this.r = sqrt(this.mass);
		this.isSolid = false;
		blackHoles.push(this);
	}

	destroy() {
		super.destroy();
		blackHoles.splice(blackHoles.indexOf(this), 1);
	}

	show() {
		noStroke();

		fill(255, random(15, 30));
		circle(this.pos.x, this.pos.y, (this.r * 2) + 10);

		fill(255, random(30, 40));
		circle(this.pos.x, this.pos.y, (this.r * 2) + 5);

		fill(0);
		circle(this.pos.x, this.pos.y, this.r * 2);

		super.show(255);
	}

	update() {
		this.r = sqrt(this.mass);
		super.update();
	}
}

class WhiteHole extends Body {
	constructor(x, y, frozen) {
		super(x, y);
		this.mass = -120;
		this.r = sqrt(abs(this.mass));
		this.isSolid = false;

		if (frozen === true) {
			this.isFrozen = true;
		}
		
		whiteHoles.push(this);
	}

	destroy() {
		super.destroy();
		whiteHoles.splice(whiteHoles.indexOf(this), 1);
	}

	show() {		
		noStroke();

		fill(255, random(70, 100));
		circle(this.pos.x, this.pos.y, (this.r * 2) + 10);

		
		fill(255, random(90, 120));
		circle(this.pos.x, this.pos.y, (this.r * 2) + 5);

		fill(255);
		circle(this.pos.x, this.pos.y, this.r * 2);

		super.show(0);
	}

	update() {
		this.r = sqrt(abs(this.mass));
		super.update();
	}
}
