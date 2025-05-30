class FlowerBase {
  constructor(centerX, centerY, radius, hsb, score, magnitude, txt = "", type) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.hsb = hsb;
    this.score = score;
    this.magnitude = magnitude;
    this.txt = txt;
    this.type = type;
    this.org_centerX = centerX;

    let now = new Date();
    let dateString = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
    this.date = dateString;

    // this.stemColor = [120, hsb[1], hsb[2]];
    // this.stemThickness = max(1, radius * 0.08);
    this.stemColor = [random(70, 80), hsb[1], random(40, 60)];
    this.stemThickness = 2;
  }

  // displayStem() {
  //   colorMode(HSB);
  //   // let s = max(this.stemColor[1], 40);
  //   // let b = max(this.stemColor[2], 40);
  //   // stroke(this.stemColor[0], s, b);
  //   stroke(...this.stemColor);
  //   strokeWeight(this.stemThickness);
  //   line(this.centerX, height, this.centerX, this.centerY);
  // }
  displayStem(x1 = this.centerX, y1 = height, x2 = this.centerX, y2 = this.centerY) {
    colorMode(HSB);
    stroke(...this.stemColor);
    strokeWeight(this.stemThickness);
    line(x1, y1, x2, y2);
  }

  contains(mouseX, mouseY) {
    return dist(mouseX, mouseY, this.centerX, this.centerY) < this.radius;
  }

  displayWithStem() {
    colorMode(HSB);
    fill(this.hsb[0], this.hsb[1], this.hsb[2]);
    noStroke();
    ellipse(this.centerX, this.centerY, this.radius * 2, this.radius * 2);
    this.displayStem();
  }

  showInfoBox(x = infoBoxX, y = infoBoxY, w = infoBoxW, h = infoBoxH) {
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(x, y, w, h, 10);

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text(`Score: ${this.score.toFixed(2)}`, x + 10, y + 10);
    text(`Magnitude: ${this.magnitude.toFixed(2)}`, x + 10, y + 35);

    // 自動換行顯示 Text:
    let textLabel = "Text: ";
    text(textLabel, x + 10, y + 60);
    let labelWidth = textWidth(textLabel);
    let textStartX = x + 10 + labelWidth;
    let textStartY = y + 60;
    let maxTextWidth = max(20, w - 20 - labelWidth); // 加上保護機制

    let words = (this.txt || "").split(" ");
    let line = "";
    let lineY = textStartY;

    for (let word of words) {
      let testLine = line + word + " ";
      if (textWidth(testLine) > maxTextWidth) {
        text(line, textStartX, lineY);
        line = word + " ";
        lineY += 25;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      text(line, textStartX, lineY);
    }

    // Close 按鈕
    fill(200, 50, 50);
    noStroke();
    rect(x + w - 60, y + h - 30, 50, 20, 5);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("Close", x + w - 35, y + h - 20);
  }

  calculateBoxHeight(w) {
    textSize(14);
    textAlign(LEFT, TOP);

    let paddingTop = 10;
    let lineHeight = 25;
    let baseLines = 3;

    let labelWidth = textWidth("Text: ");
    let maxTextWidth = max(20, w - 20 - labelWidth); // 與 showInfoBox 相同

    let words = (this.txt || "").split(" ");
    let line = "";
    let lines = [];

    for (let word of words) {
      let testLine = line + word + " ";
      if (textWidth(testLine) > maxTextWidth) {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) lines.push(line);

    let textLineCount = lines.length;
    return paddingTop * 2 + lineHeight * (baseLines + textLineCount);
  }

  move() {
    // console.log("ouo\n");
    if(this.centerX < width * 4 / 5) {
      if(width * 4 / 5 - this.centerX < 5){
        this.centerX += width * 4 / 5 - this.centerX;
      }else{
        this.centerX += 5;
      }
    }else if(this.centerX > width * 4 / 5) {
      if(this.centerX - width * 4 / 5 < 5){
        this.centerX -= this.centerX - width * 4 / 5;
      }else{
        this.centerX -= 5;
      }
    }else{
      flower_move = null;
    }
  }

  moveBack() {
    // console.log("owo\n");
    if(this.centerX > this.org_centerX) {
      if(this.centerX - this.org_centerX < 5){
        this.centerX -= this.centerX - this.org_centerX;
      }else{
        this.centerX -= 5;
      }
    }else if(this.centerX < this.org_centerX){
      if(this.org_centerX - this.centerX < 5){
        this.centerX += this.org_centerX - this.centerX;
      }else{
        this.centerX += 5;
      }
    }else{
      flower_move_back = null;
    }
  }
}
