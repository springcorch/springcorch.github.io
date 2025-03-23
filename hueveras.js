//Tamaño del canvas
let canvas_w = 800, canvas_h = 450;

let config = {
	width: canvas_w,
	height: canvas_h,
	scene: {
		preload: precarga,
		create: crea,
		update: actualiza
	}
};

let game = new Phaser.Game(config);

let field_center = canvas_w / 2 + canvas_w / 8;

let canvas_bg;

//Cantidad máxima de huevos
let huevos_max = 100;

let huevera_b, huevera_m, huevera_d;
let huevera_x = 128;
let sprite_scale = 0.15;

let countdown = 60;
let countdown_text;
let countdown_interval;

let huevos = [];
let huevos_speed = 1;

let huevos_interval;
let huevos_interval_time = 3000;

let huevo_current = 0;
let huevo_shadow;
let egg_scale = 0.5; 

let music = {
	background: null,
	game_over: null
};

let fx = {
	mouseclick: null,
	correct: null,
	incorrect: null
};

//Cargará imagenes y audios:
function precarga() {
	this.load.image('grass_bg', 'graficos/cespedVerde.jpg');
	this.load.image('huevera', 'graficos/huevera.png');
	this.load.image('huevo', 'graficos/huevo_b.png');

	this.load.audio('background_music', 'sounds/gameplay.wav');	//musica gameplay
	this.load.audio('game_over_music', 'sounds/gameover.mp3');	//musica gameover
	this.load.audio('mouseclick_fx', 'sounds/grabegg.wav');	//sonido agarrar huevo
	this.load.audio('correct', ['sounds/correct.wav']);   // Sonido correcto
	this.load.audio('incorrect', ['sounds/incorrect.wav']); // Sonido incorrecto
}

//Mostrará en pantalla:
function crea() {
	let blanco = Phaser.Display.Color.GetColor(255, 255, 255);
	let marron = Phaser.Display.Color.GetColor(192, 128, 16);
	let dorado = Phaser.Display.Color.GetColor(255, 215, 0);

	canvas_bg = this.add.image(canvas_w / 2, canvas_h / 2, 'grass_bg');

	huevera_d = this.add.image(huevera_x, canvas_h / 2 - 128, 'huevera').setScale(sprite_scale).setTint(dorado);
	huevera_d.huevera_type = "d";

	huevera_m = this.add.image(huevera_x, canvas_h / 2, 'huevera').setScale(sprite_scale).setTint(marron);
	huevera_m.huevera_type = "m";

	huevera_b = this.add.image(huevera_x, canvas_h / 2 + 128, 'huevera').setScale(sprite_scale);
	huevera_b.huevera_type = "b";

	huevo_shadow = this.add.image(-10000, -1000, 'huevo').setTint(0x000000).setAlpha(0.5).setScale(egg_scale);

	let offset_x_min = field_center - 224;
	let offset_x_max = field_center + 224;

	for (let i = 0; i < huevos_max; i++) {
		let huevo_tmp_x = Phaser.Math.Between(offset_x_min, offset_x_max);
		let huevo_tmp_y = -64;

		let huevo_tmp = this.add.image(huevo_tmp_x, huevo_tmp_y, 'huevo').setScale(egg_scale);
		huevo_tmp.falling = i === 0;

		let color = blanco;
		let huevo_type = "b";

		let random_num = Phaser.Math.Between(1, 100);

		if (random_num % 4 === 0) {
			color = marron;
			huevo_type = "m";
		} else if (random_num % 9 === 0) {
			color = dorado;
			huevo_type = "d";
		}

		huevo_tmp.setTint(color);
		huevo_tmp.huevo_type = huevo_type;
		huevo_tmp.setInteractive({ draggable: true });

		huevo_tmp.on('pointerdown', function () {
			this.falling = false;
			huevo_shadow.setPosition(this.x + 8, this.y + 8).setScale(egg_scale);
			fx.mouseclick.play();
			this.setScale(egg_scale * 1.3);
		});

		huevos.push(huevo_tmp);
	}

	this.input.on('drag', function (pointer, object, x, y) {
		object.x = x;
		object.y = y;
		huevo_shadow.setPosition(x + 8, y + 8);
	});

	this.input.on('dragend', function (pointer, object) {
		object.setScale(egg_scale);
		huevo_shadow.setPosition(-10000, -10000);

		let correct = false;

		if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_b.getBounds(), object.getBounds())) {
			correct = (object.huevo_type === "b");
		} else if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_m.getBounds(), object.getBounds())) {
			correct = (object.huevo_type === "m");
		} else if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_d.getBounds(), object.getBounds())) {
			correct = (object.huevo_type === "d");
		}

		if (correct) {
			countdown += 5;
			fx.correct.play();
		} else if (correct === false) {
			countdown -= 5;
			fx.incorrect.play();
		}

		object.destroy();
		countdown_text.text = countdown;
	});

	countdown_text = this.add.text(700, 16, countdown, { "fontSize": 48, "fontStyle": "bold" });

	music.background = this.sound.add('background_music', { loop: true, volume: 0.25 });
	music.background.play();

	music.game_over = this.sound.add('game_over_music');
	fx.mouseclick = this.sound.add('mouseclick_fx');
	fx.correct = this.sound.add('correct');   // Cargar sonido correcto
	fx.incorrect = this.sound.add('incorrect'); // Cargar sonido incorrecto
}

//Actualizará por cada frame:
function actualiza() {
	if (countdown === 10) {
		music.background.rate = 1.25;
	}

	for (let i = 0; i < huevos.length; i++) {
		if (huevos[i].falling) {
			huevos[i].y += huevos_speed;

			// Si el huevo toca el borde inferior del canvas se destruye
			if (huevos[i].y > canvas_h + 64) {				
				huevos[i].destroy();
			}
		}
	}
}

//Logica del contador
countdown_interval = setInterval(function () {
	countdown--;
	countdown_text.text = countdown;
	
	// Llamar a la función de fin del juego si el contador es 0 o menor
	if (countdown <= 0) {
		countdown_text.text = 0;
		finalizarJuego(); 
	}
}, 1000);

//Al finalizar el juego se desactivará todo:
function finalizarJuego(scene) {
	console.log("Game Over");

	// Detener música y poner la del gameOver
	music.background.stop();
	music.game_over.play();

	// Detener el contador
	clearInterval(countdown_interval);
	//Detener la caida de los huevos
	clearTimeout(huevos_interval);
}

//Detecta si pueden caer más huevos y los cuenta siguiendo esa lógica
function next_huevo() {
	huevo_current++;
	if (huevo_current >= huevos.length) {
		//Finaliza el juego si los huevos se acaban
		console.log("Se acabaron los huevos");
		finalizarJuego();
		return;
	}
	//Si no, cae otro
	huevos[huevo_current].falling = true;
	huevos_interval_time = Math.max(400, huevos_interval_time - 100);
	huevos_interval = setTimeout(next_huevo, huevos_interval_time);
}
//Bucle
huevos_interval = setTimeout(next_huevo, huevos_interval_time);