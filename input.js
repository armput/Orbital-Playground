let clickMode = 'create';
let creationMode = 'particle';

let starUnlocked = true;
let blackHoleUnlocked = true;
let whiteHoleUnlocked = true;
let wormHoleUnlocked = true;

function keyPressed() {
	if (key === 'c') {
		clickMode = 'create';
	} else if (key === 'd') {
		clickMode = 'destroy';
	} else if (key === 'f') {
		clickMode = 'freeze';
	}

	if (key === '1') {
		creationMode = 'particle';
	} else if (key === '2' && starUnlocked) {
		creationMode = 'star';
	} else if (key === '3' && blackHoleUnlocked) {
		creationMode = 'blackHole';
	} else if (key === '4' && whiteHoleUnlocked) {
		creationMode = 'whiteHole';
	} else if (key === '5' && wormHoleUnlocked) {
		creationMode = 'wormHole';
	}

	if (key === '/') {
		debug = !debug;
		console.log('Toggled debug');
	}
}

function mousePressed() {
	if (clickMode === 'create') {
		if (creationMode === 'particle') {
			new Particle(mouseX, mouseY);
		} else if (creationMode === 'star') {
			new Star(mouseX, mouseY);
		} else if (creationMode === 'blackHole') {
			new BlackHole(mouseX, mouseY);
		} else if (creationMode === 'whiteHole') {
			new WhiteHole(mouseX, mouseY);
		}
	}

	bodies.forEach(body => {
		if (createVector(mouseX, mouseY).dist(body.pos) < body.r) {
			if (clickMode === 'destroy') {
				body.destroy();
			} else if (clickMode === 'freeze') {
				body.isFrozen = !body.isFrozen;
			}
		}
	})
}