class Player {
    constructor(ctx, x, y, floor) {
        this.ctx = ctx;

        this.w = 80;
        this.h = 80;

        this.x = x;
        this.y = y;

        this.floor = floor;
        
        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 1; 

        this.img = new Image();
        this.img.frames = 3;
        this.img.frameIndex = 0;
        this.img.src = "../assets/images/totakeke.png";

        this.tick = 0;
        
        this.isJumping = false; 
    }

    move() {
        this.vy += this.ay; 
        this.vx += this.ax;

        this.x += this.vx;
        this.y += this.vy;

       // abajo colisión
        if (this.y + this.h >= this.floor) {
            this.vy = 0;
            this.y = this.floor - this.h; 
            this.isJumping = false; 
        }

        // superior
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        // izquierdo
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        // derecho
        if (this.x + this.w > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.w;
            this.vx = 0;
        }
    }

    draw() {
        this.ctx.drawImage(   
            this.img,
            (this.img.frameIndex / this.img.frames) * this.img.width,
            0,
            (1 / this.img.frames) * this.img.width,
            this.img.height,
            this.x,
            this.y,
            this.w,
            this.h
        );

        this.tick++;

        if (this.tick > 10) {
            this.tick = 0;
      
            this.img.frameIndex++;
            if (this.img.frameIndex > 2) {
              this.img.frameIndex = 0;
            }
          }
      
          if (this.isJumping) {
            this.img.frameIndex = 2;
          }
        }

    jump() {
        if (!this.isJumping) {
            this.vy = -18;  //salto
            this.isJumping = true; 
        }
    }

    onKeyDown(code) {
        switch (code) {
          case KEY_UP:
            this.jump();
            break;
          case KEY_RIGHT:
            this.vx = 10; // Velocidad derecha
            break;
          case KEY_LEFT:
            this.vx = -10; // Velocidad izquierda
            break;
        }
    }

    onKeyUp(code) {
        switch (code) {
          case KEY_RIGHT:
          case KEY_LEFT:
            this.vx = 0;
            break;
        }
    }

    collides(el) {
        const colX = el.x <= this.x + this.w && el.x + el.w >= this.x;
        const colY = el.y <= this.y + this.h && el.y + el.h >= this.y;
    
        return colX && colY;
    }


}
