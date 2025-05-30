// API(or server)-related variables
let socket;

// variables of objects
let bg_image; // background
let sun; // sun (left top)
let input_field; // diary input field
let gradient_bar; // description box (right top)
let flowers = []; // flowers (diaries)
let gif_image; // information
let music; // BGM

// variables related to object control
let show_input_field = false;
let bar_length = 150;
let used_columns = []; // 儲存已使用的 X 欄位
let column_count = 20; // X 軸欄位總數(花數量最大值)
let min_x_distance = 50;
let min_y_distance = 100; // Y 座標距離畫布底部的最小間距
let max_y_distance = 100; // Y 座標距離畫布頂部的最小間距
let active_flower = null;
let flower_info_box_w;
let flower_info_box_h;
let flower_info_box_x;
let flower_info_box_y;
let flower_move = null;
let flower_move_back = null;
let show_infor = true;

// Variables related to object color
let color_palette; // csv file of color (HSB)
let manjusaka_palette = 0; // row 0 (line 2)- used by Manjusaka
let dandelion_palette = 1; // row 1 (line 3) - used by Dandelion
let daisy_palette = 2; // row 2 (line 4) - used by Daisy
let sun_palette = 3; // row 3 - used by the sun (left top)
let input_field_palette = 4; // row 4 - diary's input field
let flower_info_palette = 5; // row 5 - flower info box


// ==========================================================
// ===== load the background image & the color.csv file =====
// ==========================================================
function preload() {
    color_palette = loadTable("./color.csv", "csv", "header");
    bg_image = loadImage("./image/background.png");
    gif_image = loadImage("./image/flowerBook.GIF"); 
    music= loadSound("./music/music.mp3");
}

// ===============================================================
// ===== get the flower's color code from the color.csv file =====
// ===============================================================
function getFlowerColor(palette, saturation) {
    let n = 2; 
    let scaled = saturation * n;
    let idx1 = Math.floor(scaled);
    let idx2 = Math.ceil(scaled);
    let local_t = scaled - idx1;

    let hsb1 = getColor(palette, idx1);
    let hsb2 = getColor(palette, idx2);

    let h1 = hsb1[0], h2 = hsb2[0];
    if (h2 < h1) h2 += 360;

    let h = lerp(h1, h2, local_t) % 360;
    let s = lerp(hsb1[1], hsb2[1], local_t);
    let b = lerp(hsb1[2], hsb2[2], local_t);

    return [h, s, b];
}

// ========================================================================
// ===== get the color code (except flower's) from the color.csv file =====
// ========================================================================
function getColor(i, j){

    let h = int(color_palette.get(i, j * 3));
    let s = int(color_palette.get(i, j * 3 + 1));
    let b = int(color_palette.get(i, j * 3 + 2));

    return [h, s, b];
}

// ================================================================================
// ===== the functions of this part is about creating and showing the objects =====
// ================================================================================

// ----- create sun object (left top) -----
function createSun(){
    sun = new Sun(sun_palette);
}

// ----- show sun (left top) -----
function showSun(){
    sun.show();
}

// ----- create input field object -----
function createInputField(){
    input_field = new InputField(input_field_palette);

    let canvas = document.querySelector('canvas');
    canvas.addEventListener('paste', handlePaste);

    input_box = createElement('textarea');
    input_box.addClass('transparent-input'); 
    input_box.position(input_field.x - input_field.w/2 + 15, input_field.y - input_field.h/2 + 10);
    input_box.size(input_field.w - 30, input_field.h - 20);
    input_box.hide();
}

// ----- show input field -----
function showInputField() {
    if (show_input_field) {
        input_field.show();
        input_field.showButtons();
        input_box.show();
        input_box.position(input_field.x - input_field.w/2 + 15, input_field.y - input_field.h/2 + 10);
        input_box.size(input_field.w - 30, input_field.h - 20);
        input_box.elt.focus();
        input_box.input(() => {
            input_field.text = input_box.value();
        });
    } else {
        input_box.hide();
    }
}

// ----- show background -----
function showBackground(){
    if (bg_image) {
        image(bg_image, 0, 0, width, height);
    } else {
        background(0, 0, 100); 
    }
}

// ----- create flower object -----
function createFlower(score, magnitude, word_count, pos_proportion) {
    if (used_columns.length >= column_count) {
        console.warn("max flowers: " + column_count);
        return null;
    }

    let available_columns = [];
    for (let i = 0; i < column_count; i++) {
        if (!used_columns.includes(i)) {
            available_columns.push(i);
        }
    }

    let col_index = random(available_columns);
    used_columns.push(col_index);

    let col_width = (width - 2 * min_x_distance) / column_count; 
    let x = min_x_distance + col_width * col_index + col_width / 2;  
    let y = random(max_y_distance, height - min_y_distance);

    let flower;
    if (score < -0.25) {
        flower = new Manjusaka(x, y, 20 * word_count / 50 + 40, getFlowerColor(manjusaka_palette, magnitude / 7), score, magnitude, input_field.text, "Manjusaka");
    } else if (score <= 0.25) {
        flower = new Dandelion(x, y, 15 * word_count / 50 + 20, getFlowerColor(dandelion_palette, magnitude / 7), score, magnitude, input_field.text, "Dandelion");
    } else {
        flower = new Daisy(x, y, 20 * word_count / 50 + 40, getFlowerColor(daisy_palette, magnitude / 7), score, magnitude, input_field.text, "Daisy");
    }
    input_field.text = "";

    flowers.push(flower);
}

// ----- show flowers -----
function showFlowers(){
    for (let f of flowers) {
        f.displayWithStem();
    }
}

// ----- create help sign (right top corner) -----
function createHelpSign(){
    gradient_bar = new ColorGradientBar(color_palette, width -  bar_length * 2, 50, bar_length, 10);
}

// ----- show help sign -----
function showHelpSign(){
    // 繪製問號圖示 (右上角)
    fill(80, 29, 28);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("?", width - 50, 50);

    // 偵測滑鼠是否停留在問號圖示上
    let d = dist(mouseX, mouseY, width - 50, 50);
    if (d < 15) {
        gradient_bar.display();
    }
}

// ----- create flower book (information) -----
function createFlowerBook(){
    gif_image = createImg("./image/flowerBook.gif");
    gif_image.size(70, 70);
    gif_image.position(width - 80, height - 100);
    gif_image.style('border', 'none');
}

// ----- show flower book (information) -----
function showFlowerBook(){
    if (show_infor) {
        fill(48, 10, 100);
        stroke(76, 22, 76);
        strokeWeight(3);
        rect(width / 2 - 150, height / 2 - 200, 290, 390,10);
        fill(80, 29, 28);
        noStroke();
        textSize(14);
        textAlign(LEFT, TOP);
        text("📖💐 About FLORA:\n\n\❓Wondering about the flower’s score, magnitude, or emotional tone? Just hover over the question mark in the top-right corner!\n\n🌞Click the sun in the top-left to enter your diary and see your emotion bloom as a flower!\n\n🌸Then,you can click the flower to check the flower's data based on your input.\n\n  👉Come on, try it out👈\n(Click anywhere to close. Reopen it from the bottom-right corner.) ", width / 2 - 115, height / 2 - 180, 250);
    }
}

// ----- show flower info box -----
function showFlowerInfo(){
    flower_info_box_w = 300;
    flower_info_box_h = 300;
    flower_info_box_x = width / 3 - flower_info_box_w / 2;
    flower_info_box_y = 50;
    if (flower_move) {
        flower_move.move();
    }else if(flower_move_back){
        flower_move_back.moveBack();
    }else{
        if (active_flower) {
            let flower_info_box = new FlowerInfoBox(flower_info_box_x, flower_info_box_y, flower_info_box_w, flower_info_box_h, active_flower, flower_info_palette);
            flower_info_box.display();
        }
    }
}

// ----- dims BG when a flower is clicked -----
function dimBackground(){
    if(active_flower){
        push();
        noStroke();
        fill(color(65, 27, 68, 0.3));
        rect(0, 0, width, height);
        pop();

        active_flower.displayWithStem();
    }
}

// ======================================
// ===== handling mouse click event =====
// ======================================
function mousePressed() {
    // ----- music -----
    if (music && !music.isPlaying()) {
        music.loop();
    }
    // ----- detect whether the flower book is clicked -----
    if(!show_infor){
        if(
            mouseX > width - 80 &&
            mouseX < width - 10 &&
            mouseY > height - 100 &&
            mouseY < height - 30
        ){
            show_infor = true;
        }
    }else{
        show_infor = false;
    }
    // ----- detect whether the sun is clicked -----
    if (dist(mouseX, mouseY, sun.x, sun.y) <= sun.radius){
        show_input_field = true;
        input_field.active = true;
    }

    // ----- Detect user interaction with the input field -----
    if (show_input_field) {
        const btn_area = input_field.showButtons();

        // button "plant" clicked
        if (
            mouseX > btn_area.plant.x - btn_area.plant.w / 2 &&
            mouseX < btn_area.plant.x + btn_area.plant.w / 2 &&
            mouseY > btn_area.plant.y - btn_area.plant.h / 2 &&
            mouseY < btn_area.plant.y + btn_area.plant.h / 2
        ) {
            const data = {
                text: input_field.text
            };
            socket.emit('diary', data);
            show_input_field = false;
            input_field.active = false;
            input_box.value(""); 
            return;
        }

        // button "close" clicked
        if (
            mouseX > btn_area.close.x - btn_area.close.w / 2 &&
            mouseX < btn_area.close.x + btn_area.close.w / 2 &&
            mouseY > btn_area.close.y - btn_area.close.h / 2 &&
            mouseY < btn_area.close.y + btn_area.close.h / 2
        ) {
            show_input_field = false;
            input_field.active = false;
            input_field.text = "";
            input_box.value("");
            return;
        }

        // input field clicked
        input_field.clicked();
    }
    // ----- close flower info box -----
    else if (
        active_flower &&
        mouseX > flower_info_box_x + flower_info_box_w - 60 &&
        mouseX < flower_info_box_x + flower_info_box_w - 10 &&
        mouseY > flower_info_box_y + flower_info_box_h - 30 &&
        mouseY < flower_info_box_y + flower_info_box_h - 10
    ) {
        flower_move_back = active_flower;
        active_flower = null;
    } 
    // ----- show flower info box (flower clicked) -----
    else {
        for (let f of flowers) {
            if (f.contains(mouseX, mouseY)) {
                active_flower = f;
                flower_move = f;
                break;
            }
        }
    }
}

// =================================================================================
// ===== the functions under this line is used to hand user input & copy-paste =====
// =================================================================================

// ----- handle alphabets & numbers -----
function keyTyped() {
    if (show_input_field) {
        input_field.keyTyped(key);
    }
}

// ----- handle backspace .etc -----
function keyPressed() {
    input_field.keyPressed(keyCode);
}

// ----- handle copy-paste -----
function handlePaste(e) {
    if (show_input_field && input_field.active) {
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        input_field.text += paste;
        e.preventDefault();
    }
}

// ================================
// ===== p5.js setup function =====
// ================================
function setup() {
    // ----- related to API -----
    // socket = io.connect('http://localhost:3000');
    socket = io.connect(window.location.origin);
    socket.on('analyze_result', (result) => {
        createFlower(result.score, result.magnitude, result.word_count, result.pos_proportion);
    })

    colorMode(HSB);
    textFont('Courier New');
    textStyle(BOLD);
    
    createCanvas(720, 480);

    createSun();
    createInputField();
    createHelpSign();
    createFlowerBook();
}

// ===============================
// ===== p5.js draw function =====
// ===============================
function draw() {
    showBackground();
    showSun();
    showFlowers();
    dimBackground();
    showInputField();
    showFlowerInfo();
    showFlowerBook();
    showHelpSign();
}