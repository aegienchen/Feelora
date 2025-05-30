class Dandelion extends FlowerBase {
  constructor(centerX, centerY, radius, hsb, score, magnitude, txt = "", type) {
    super(centerX, centerY, radius, hsb, score, magnitude, txt, type);

    this.centerX = centerX;
    this.centerY = centerY;
    this.finalRadius = radius;

    this.currentY = height;
    this.currentRadius = 0;
    this.animationProgress = 0;
    this.animationSpeed = 0.02;

    this.hsb = hsb;

    this.points = [];
    this.generatePoints(); // 點資料預生成但根據 currentRadius 顯示
  }

  generatePoints() {
    this.points = [];
    for (let r = this.finalRadius; r > 0; r -= 2) {
      let numPoints = this.finalRadius;
      for (let i = 0; i < numPoints; i++) {
        let angle = random(TWO_PI);
        let relX = r * cos(angle);
        let relY = r * sin(angle);
        let vx = cos(angle) * random(0.2, 0.5);
        let vy = sin(angle) * random(0.2, 0.5);
        this.points.push({
          relX, relY,
          x: relX,
          y: relY,
          vx, vy,
          alpha: 255
        });
      }
    }
  }

  updateAnimation() {
    this.animationProgress = min(1, this.animationProgress + this.animationSpeed);
    this.currentY = lerp(height, this.centerY, this.animationProgress);
    this.currentRadius = lerp(0, this.finalRadius, this.animationProgress);
  }

  display() {
    this.updateAnimation();

    colorMode(HSB);
    noStroke();

    // 光暈
    drawingContext.shadowBlur = 50;
    let smallerS = max(10, this.hsb[1] - 30);
    let smallerB = max(10, this.hsb[2] - 30);
    drawingContext.shadowColor = `hsb(${this.hsb[0]}, ${smallerS}%, ${smallerB}%)`;
    fill(this.hsb[0], this.hsb[1], this.hsb[2], 0.4);
    if(this.centerY == this.currentY){
      circle(this.centerX, this.centerY, this.currentRadius * 2.1);
    }else{
      circle(this.centerX, this.currentY, this.currentRadius * 2.1);
    }

    drawingContext.shadowBlur = 0;

    for (let p of this.points) {
      p.x += p.vx;
      p.y += p.vy;

      let d = dist(p.relX, p.relY, p.x, p.y);
      p.alpha = max(0, 255 - d * 8);

      if (p.alpha <= 0) {
        let angle = random(TWO_PI);
        p.x = p.relX;
        p.y = p.relY;
        p.vx = cos(angle) * random(0.2, 0.5);
        p.vy = sin(angle) * random(0.2, 0.5);
        p.alpha = 255;
      }

      fill(this.hsb[0], this.hsb[1], this.hsb[2], p.alpha / 255);
      if(this.centerY == this.currentY){
        circle(this.centerX + p.x * (this.currentRadius / this.finalRadius), 
             this.centerY + p.y * (this.currentRadius / this.finalRadius), 
             2);
      }else{
        circle(this.centerX + p.x * (this.currentRadius / this.finalRadius), 
             this.currentY + p.y * (this.currentRadius / this.finalRadius), 
             2);
      }
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