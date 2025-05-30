class Daisy extends FlowerBase {
  constructor(centerX, centerY, radius, hsb, score, magnitude, txt = "", type) {
    super(centerX, centerY, radius, hsb, score, magnitude, txt, type);
    
    this.finalX = centerX;
    this.finalY = centerY;
    this.finalRadius = radius;

    this.currentY = height;
    this.currentRadius = 0;
    this.animationProgress = 0;
    this.animationSpeed = 0.01;

    this.rotation = 0;

    this.coreRadiusRatio = 0.4;
    this.petalLengthRatio = 0.6;
    this.petals = 20;
  }

  updateAnimation() {
    this.animationProgress = min(1, this.animationProgress + this.animationSpeed);
    this.currentY = lerp(height, this.finalY, this.animationProgress);
    this.currentRadius = lerp(0, this.finalRadius, this.animationProgress);
  }

  drawPetal(x, y, angle) {
    push();
    translate(x, y);
    rotate(angle);
    fill(this.hsb[0], this.hsb[1], this.hsb[2], 0.8);
    ellipse(0, 0, this.currentRadius * this.petalLengthRatio, this.currentRadius * this.petalLengthRatio * 0.35); 
    pop();
  }

  display() {
    this.updateAnimation();

    colorMode(HSB);
    let strokeB = min(this.hsb[2] - 10, 90);
    stroke(this.hsb[0], this.hsb[1], strokeB);
    strokeWeight(0.5);

    this.rotation += 0.01;

    for (let i = 0; i < this.petals; i++) {
      let angle = TWO_PI * (i / this.petals) + this.rotation;
      let x = this.centerX + cos(angle) * this.currentRadius * 0.7;
      let y = this.currentY + sin(angle) * this.currentRadius * 0.7;
      this.drawPetal(x, y, angle);
    }

    // 花蕊
    let centerS = max(this.hsb[1], 40);
    let centerB = max(this.hsb[2], 40);
    fill(40, centerS, centerB);
    circle(this.centerX, this.currentY, this.currentRadius * this.coreRadiusRatio * 2);
  }

  displayWithStem() {
    // 動畫位置更新中，stem 終點是 currentY
    this.displayStem(this.centerX, height, this.centerX, this.currentY);
    this.display();
  }

  isAnimationDone() {
    return this.animationProgress >= 1;
  }
}
