class Sun {
    constructor(palette){
        this.x = 0;
        this.y = 0;
        this.radius = 100;
        this.glow_radius = this.radius;
        this.color1 = color(...getColor(sun_palette, 0));
        this.color2 = color(...getColor(sun_palette, 1));
        this.color3 = color(...getColor(sun_palette, 2));
        this.color4 = color(...getColor(sun_palette, 3));
        this.color5 = color(...getColor(sun_palette, 4));
    }
    show(){
        let is_hover = dist(mouseX, mouseY, this.x, this.y) <= this.radius;
        if (is_hover) {
            this.glow_radius += 10;
            let max_radius_x = max(this.x, width - this.x);
            let max_radius_y = max(this.y, height - this.y);
            let max_radius = min(max_radius_x, max_radius_y);
            if (this.glow_radius * 2 > max_radius * 2) {
                this.glow_radius = max_radius;
            }
            if (this.glow_radius > 1000) this.glow_radius = 1000;
        } else {
            this.glow_radius -= 20;
            if (this.glow_radius < this.radius) this.glow_radius = this.radius;
        }

        push();
        translate(this.x, this.y);
        noStroke();

        let steps = 100;
        let color_stops = [this.color1, this.color2, this.color3, this.color4, this.color5];
        for (let i = steps; i > 0; i--) {
            let t = i / steps;
            let idx = Math.floor(t * (color_stops.length - 1));
            let local_t = (t * (color_stops.length - 1)) - idx;
            let c;
            if (idx >= color_stops.length - 1) {
                c = color_stops[color_stops.length - 1];
            } else {
                c = lerpColor(color_stops[idx], color_stops[idx + 1], local_t);
            }
            let alpha = map(i, steps, 1, 0, 120);
            c.setAlpha(alpha);
            fill(c);
            ellipse(0, 0, this.glow_radius * 2 * t, this.glow_radius * 2 * t);
        }

        if (is_hover) {
            fill(80, 29, 28);
            textSize(12);
            textAlign(CENTER, CENTER);
            text("Click to plant a flower!", 100, 70);
        }

        pop();
    }
}