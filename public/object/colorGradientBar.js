class ColorGradientBar {
  constructor(color_palette, x, y, width, height) {
    this.color_palette = color_palette;
    this.x = x; // 起始 x 位置
    this.y = y; // 起始 y 位置
    this.width = width; // 色條寬度
    this.height = height; // 色條高度
  }

  display() {
    textSize(12);
    textAlign(CENTER, CENTER);
    fill(80, 29, 28);
    noStroke();

    // 在最上方標示 "Score" 和 "Magnitude"
    textAlign(RIGHT, CENTER);
    text("Score", this.x - 20, this.y - 15);
    textAlign(CENTER, CENTER);
    text("Magnitude", this.x + this.width / 2, this.y - 15);

    // Magnitude數值顯示在最後一條下方
    let last_bar_y = this.y + 3 * (this.height + 5) + 5;
    text("0", this.x, last_bar_y);
    text("3.5", this.x + this.width / 2, last_bar_y);
    text("7", this.x + this.width, last_bar_y);

    // row 0: manjusaka, row 1: dandelion, row 2: daisy
    for (let row = 0; row < 3; row++) {
      let bar_y = this.y + row * (this.height + 5); // 增加間距以避免文字重疊

      // 根據 row 來決定對應的 score 範圍
      let score_label = row === 0 ? "-1 ~ -0.25" :
                       row === 1 ? "-0.25 ~ 0.25" :
                                   "0.25 ~ 1";

      // 在色條左側標示 score 範圍
      fill(80, 29, 28);
      noStroke();
      textAlign(RIGHT, CENTER);
      text(score_label, this.x - 20, bar_y + this.height / 2);

      for (let i = 0; i < this.width; i++) {
        let magnitude = map(i, 0, this.width, 0, 1);
        // 根據 row 取得對應花的 palette
        let palette_index = row; // 0: manjusaka, 1: dandelion, 2: daisy
        let color_arr = getFlowerColor(palette_index, magnitude);

        colorMode(HSB);
        stroke(color_arr[0], color_arr[1], color_arr[2]);
        strokeWeight(1);
        line(this.x + i, bar_y, this.x + i, bar_y + this.height);
      }

      // 標示花的名稱
      fill(80, 29, 28);
      noStroke();
      textAlign(LEFT, CENTER);
      let flower_name = row === 0 ? "Manjusaka" : row === 1 ? "Dandelion" : "Daisy";
      text(flower_name, this.x + this.width + 10, bar_y + this.height / 2);
    }
  }
}