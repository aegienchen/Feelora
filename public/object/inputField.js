class InputField {
    constructor(input_field_palette) {
        this.x = width / 2;
        this.y = height / 2;
        this.w = width * 2 / 3;
        this.h = height * 2 / 3;
        this.bg_color = color(...getColor(input_field_palette, 4));
        this.stroke_color = color(...getColor(input_field_palette, 2));
        this.text_color = color(...getColor(input_field_palette, 0));
        this.btn_close_color = color(...getColor(input_field_palette, 3));
        this.btn_plant_color = color(...getColor(input_field_palette, 1));
        this.text = "";
        this.active = false;
    }

    show() {
        push();
        rectMode(CENTER);
        stroke(this.stroke_color);
        strokeWeight(5);
        fill(this.bg_color);
        rect(this.x, this.y, this.w, this.h, 5);
        pop();

        fill(this.text_color);
        noStroke();
        textAlign(LEFT, TOP);
        textSize(15);
        textWrap(WORD);
        let display_text = this.text;
        if (this.active && frameCount % 60 < 30) {
            display_text += "|";
        }
        text(
            display_text,
            this.x - this.w / 2 + 15,
            this.y - this.h / 2 + 10,
            this.w - 15,
            this.h - 10
        );
    }

    showButtons(plant_label = "Plant", close_label = "Close") {
        let btn_w = 80, btn_h = 36;
        let plant_btn_x = this.x + this.w / 2 - btn_w / 2 - 10;
        let plant_btn_y = this.y + this.h / 2 + 20;
        let close_btn_x = this.x - this.w / 2 + btn_w / 2 + 10;
        let close_btn_y = plant_btn_y;
        
        //plant btn
        push();
        rectMode(CENTER);
        fill(this.btn_plant_color);
        rect(plant_btn_x, plant_btn_y, btn_w, btn_h, 8);
        fill(this.text_color);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(18);
        text(plant_label, plant_btn_x, plant_btn_y);
        pop();

        //close btn
        push();
        rectMode(CENTER);
        fill(this.btn_close_color);
        rect(close_btn_x, close_btn_y, btn_w, btn_h, 8);
        fill(this.text_color);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(18);
        text(close_label, close_btn_x, close_btn_y);
        pop();

        return {
            plant: { x: plant_btn_x, y: plant_btn_y, w: btn_w, h: btn_h },
            close: { x: close_btn_x, y: close_btn_y, w: btn_w, h: btn_h }
        };
    }

    clicked() {
        if (
            mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 &&
            mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2
        ) {
            this.active = true;
        } else {
            this.active = false;
        }
    }

    keyTyped(key) {
        if (this.active) {
            this.text += key;
        }
    }

    keyPressed(key_code) {
        if (this.active && key_code === BACKSPACE) {
            this.text = this.text.slice(0, -1);
        }
    }
}