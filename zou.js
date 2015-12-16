
enchant();

var screen_width = window.innerWidth;
var screen_height = window.innerHeight;
var game, physicsWorld;

window.onload = function () {
    game = new Game(screen_width, screen_height);
    game.fps = 50;
    game.preload(
        "img/zou.png",
        "img/zou2.png",
        "img/sake.png",
        "img/beer.png",
        "img/ground.jpg",
        "img/aizon.png",
        "img/aizon_fire.png");


    game.onload = function () {
        physicsWorld = new PhysicsWorld(0, 5);

        var i, floor, wall, zou, beam;
        for(i = 0; i < 100; i++){
            // 地面
            floor = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 1, 1, true);
            floor.image = game.assets["img/ground.jpg"];
            floor.position = { x: i * 16, y: screen_height };
            game.rootScene.addChild(floor);
        }

        // 攻撃
        var beamMax = 3;

        // 左の酒
        beamleft = new Array();
        for(var i=0; i<beamMax; i++){
          beamleft[i] = new PhyBoxSprite(24, 24, enchant.box2d.DYNAMIC_SPRITE, 100, 1.0, 0, true);
          beamleft[i].image = game.assets["img/sake.png"];
          beamleft[i].x = -beamleft[i].width - 200;
          beamleft[i].flag = false;
          game.rootScene.addChild(beamleft[i]);
        }

        // 右の酒
        beamright = new Array();
        for(var i=0; i<beamMax; i++){
          beamright[i] = new PhyBoxSprite(24, 24, enchant.box2d.DYNAMIC_SPRITE, 100, 1.0, 0, true);
          beamright[i].image = game.assets["img/beer.png"];
          beamright[i].x = -beamright[i].width - 200;
          beamright[i].flag = false;
          game.rootScene.addChild(beamright[i]);
        }
        game.keybind(90, "z");

        // メカソン生成
        mechason = new PhyBoxSprite(76,80,enchant.box2d.DYNAMIC_SPRITE, 0, 0, 0, true);
    		mechason.image = game.assets['img/aizon.png'];
    		mechason.y = screen_height - 88.5;
    		mechason.vx = screen_width / 2 - 350;
    		game.addEventListener(Event.ENTER_FRAME, function(event) {
    			var ax = 0;
    			/*徐々に移動スピードが加速*/
    			if(game.input.right){
    				ax += 0.5;
    			}
    			if(game.input.left){
    				ax -= 0.5;
    			}
    			if (mechason.vx > 0.3){
    				ax -= 0.3;
    			}
    			else if (mechason.vx > 0){
    				ax -= mechason.vx;
    			}
    			if (mechason.vx < -0.3){
    				ax += 0.3;
    			}
    			else if (mechason.vx < 0){
    				ax -= mechason.vx;
    			}

          // 重力
      		mechason.vy = 0;
    			mechason.jumping = false;
    			if(game.input.up && !mechason.jumping) {
    				mechason.vy = -15;
    				mechason.jumping = true;
            mechason.image = game.assets['img/aizon_fire.png'];
    			} else {
            mechason.image = game.assets['img/aizon.png'];
          }
    			mechason.vy += 8;
    			mechason.x += mechason.vx;
    			mechason.y += mechason.vy;

    			if(mechason.y >= screen_height - 88.5) {
    				mechason.y = screen_height - 88.5;
    				mechason.jumping = false;
    			}
    			mechason.vx += ax;
    			mechason.vx = Math.min(Math.max(mechason.vx, -15), 10);
    			mechason.x += mechason.vx;

          for(var i=0; i<beamMax; i++){
            if (beamleft[i].flag == true){
              beamleft[i].x = beamleft[i].x - 24;
              if (beamleft[i].x < -beamleft[i].width){
                beamleft[i].flag = false;
              }
            }
          }
          if (game.input.z){
            for(var i=0; i<beamMax; i++){
              if (beamleft[i].flag == true){ continue; }
              beamleft[i].flag = true;
              beamleft[i].x = mechason.x - 50;
              beamleft[i].y = mechason.y + 45;
              break;
            }
          }

          for(var i=0; i<beamMax; i++){
            if (beamright[i].flag == true){
              beamright[i].x = beamright[i].x + 24;
              if (beamright[i].x > screen_width){
                beamright[i].flag = false;
              }
            }
          }
          if (game.input.z){
            for(var i=0; i<beamMax; i++){
              if (beamright[i].flag == true){ continue; }
              beamright[i].flag = true;
              beamright[i].x = mechason.x + 100;
              beamright[i].y = mechason.y + 45;
              break;
            }
          }
    		});
        game.rootScene.addChild(mechason);

        game.rootScene.addEventListener("enterframe", function () {
            physicsWorld.step(game.fps);
            if(game.frame % game.fps === 0){
                // ぞう1
                var zou = new PhyCircleSprite(14, enchant.box2d.DYNAMIC_SPRITE, 0.05, 3, 0.5, true);
                zou.image = game.assets["img/zou.png"];
                zou.frame = 4;
                zou.position = { x: 0, y: 120 };
                zou.applyImpulse(new b2Vec2(Math.random(), 0));
                game.rootScene.addChild(zou);
                zou.addEventListener("enterframe", function(){
                    if(zou > 320)zou.destroy();
                });

                // ぞう2
                var zou2 = new PhyCircleSprite(14, enchant.box2d.DYNAMIC_SPRITE, 0.05, 0.9, 0.3, true);
                zou2.image = game.assets["img/zou2.png"];
                zou2.frame = 2;
                zou2.position = { x: screen_width, y: Math.random() * screen_height };
                zou2.applyImpulse(new b2Vec2(-Math.random(), 0));
                game.rootScene.addChild(zou2);
                zou2.addEventListener("enterframe", function(){
                    if(zou2 > 320)zou2.destroy();
                });
            }
        });

    };
    game.start();
};
