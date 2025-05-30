class Manjusaka extends FlowerBase {
  constructor(centerX, centerY, radius, hsb, score, magnitude, txt = "", type) {
    super(centerX, centerY, radius, hsb, score, magnitude, txt, type);

    this.centerX = centerX;
    this.centerY = centerY;
    this.finalRadius = radius;

    this.currentY = height;
    this.currentRadius = 0;
    this.animationProgress = 0;
    this.animationSpeed = 0.01;

    this.hsb = hsb;

    this.stamens = 7;
    this.pistils = 7;
  }

  updateAnimation() {
    this.animationProgress = min(1, this.animationProgress + this.animationSpeed);
    this.currentY = lerp(height, this.centerY, this.animationProgress);
    this.currentRadius = lerp(0, this.finalRadius, this.animationProgress);
  }

  drawStamen(angle, mirror = false, openFactor = 1) {
    push();
    if(this.centerY == this.currentY){
      translate(this.centerX, this.centerY);
    }else{
      translate(this.centerX, this.currentY);
    }
    if (mirror) scale(-1, 1);
    rotate(angle);
    colorMode(HSB);
    stroke(this.hsb[0], this.hsb[1], this.hsb[2]);
    noFill();
    beginShape();
    for (let t = 0; t < PI; t += 0.1) {
      let x = cos(t) * this.currentRadius * 0.3 * sin(2 * t) * openFactor;
      let y = -sin(t) * this.currentRadius * openFactor;
      vertex(x, y);
    }
    endShape();
    pop();
  }

  drawPistil(angle) {
    push();
    if(this.centerY == this.currentY){
      translate(this.centerX, this.centerY);
    }else{
      translate(this.centerX, this.currentY);
    }
    rotate(angle);
    colorMode(HSB);
    let largerS = min(this.hsb[1] + 20, 90);
    let smallerB = max(10, this.hsb[2] - 10);
    stroke(this.hsb[0], largerS, smallerB);
    noFill();
    beginShape();
    for (let t = 0; t < PI; t += 0.1) {
      let x = cos(t) * this.currentRadius * 0.08 * sin(3 * t); 
      let y = -sin(t) * this.currentRadius * 0.7;
      vertex(x, y);
    }
    endShape();
    pop();
  }

  display() {
    this.updateAnimation();

    colorMode(HSB);
    strokeWeight(2);
    let openFactor = 0.7 + 0.2 * sin(frameCount * 0.05);

    for (let i = 0; i < this.stamens; i++) {
      let a = map(i, 0, this.stamens, radians(10), radians(110));
      this.drawStamen(a, false, openFactor);
      this.drawStamen(a, true, openFactor);
    }

    for (let i = 0; i < this.pistils; i++) {
      let a = map(i, 0, this.pistils - 1, -radians(40), radians(40));
      this.drawPistil(a);
    }
  }

  displayWithStem() {
    if(this.centerY == this.currentY){
      this.displayStem(this.centerX, height, this.centerX, this.centerY);
    }else{
      this.displayStem(this.centerX, height, this.centerX, this.currentY);
    }
    this.display();
  }

  isAnimationDone() {
    return this.animationProgress >= 1;
  }
}
