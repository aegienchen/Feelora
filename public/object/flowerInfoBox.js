class FlowerInfoBox {
    constructor(x, y, w, h, flower, palette) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.flower = flower;
        this.color1 = color(...getColor(palette, 0));
        this.color2 = color(...getColor(palette, 1));
        this.color3 = color(...getColor(palette, 2));
        this.color4 = color(...getColor(palette, 3));
        this.color5 = color(...getColor(palette, 4));
    }

    display() {
        push();
        rectMode(CORNER);
        colorMode(HSB);
        fill(this.color3);
        stroke(this.color2);
        strokeWeight(2);
        rect(this.x, this.y, this.w, this.h, 16);

        fill(this.color1);
        noStroke();
        textSize(16);
        textAlign(LEFT, TOP);
        text("Flower Info", this.x + 20, this.y + 15);

        textSize(12);
        text("Date: " + (this.flower.date || "N/A"), this.x + 150, this.y + 15);

        textSize(13);
        let info_y = this.y + 45;
        text("Type: " + (this.flower.type || "Unknown"), this.x + 20, info_y);
        text("Score: " + (this.flower.score !== undefined ? this.flower.score.toFixed(2) : "N/A"), this.x + 20, info_y + 25);
        text("Magnitude: " + (this.flower.magnitude !== undefined ? this.flower.magnitude.toFixed(2) : "N/A"), this.x + 20, info_y + 50);
        if (this.flower.txt) {
            text("Diary:", this.x + 20, info_y + 80);
            textSize(12);
            text(this.flower.txt, this.x + 20, info_y + 100, this.w - 40, this.h - 120);
        }

        fill(this.color4);
        rect(this.x + this.w - 60, this.y + this.h - 30, 50, 20, 8);
        fill(this.color5);
        textAlign(CENTER, CENTER);
        textSize(13);
        text("Close", this.x + this.w - 35, this.y + this.h - 20);

        pop();
    }
}