let bodies = [];
let particles = [];

class Body {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);

		this.mass = 1;
		this.invMass = 1 / this.mass;
		this.r = sqrt(this.mass) * 5;

		this.isFrozen = false;

		bodies.push(this);
	}

	applyForce(force) {
		let _force = p5.Vector.div(force, this.mass);
		this.acc.add(_force);
	}

	collide(other) {
		let impactVec = p5.Vector.dist(this.pos, other.pos);
		let distance = impactVec.mag();

		if (distance <= this.r + other.r) {
			let overlap = distance - (this.r + other.r);
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
			
			let deltaVelA = p5.Vector.mult(impactVec, 2 * other.mass *(num / den));
			this.vel.add(deltaVelA);

			let deltaVelB = p5.Vector.mult(impactVec, -2 * this.mass * (num / den));
			other.vel.add(deltaVelB);
		}
	}

	show() {
		noFill();
	}

	update() {
		if (!this.isFrozen) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}

		this.show();
	}
}

class Particle extends Body {
	constructor(x, y) {
		super(x, y);
		particles.push(this);
	}

	show() {
		noStroke();
		fill(35);
		circle(this.pos.x, this.pos.y, this.r * 2);
	}
}