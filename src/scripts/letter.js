class Letter {
  constructor(ctx, char, isTarget) {
      this.ctx = ctx;
      this.char = char;
      this.isTarget = isTarget;

      this.w = 50;
      this.h = 75;


      this.x = this.ctx.canvas.width;
      this.y = 300;

    
      this.vx = -5;
  }

  draw() {
      this.ctx.font = "100px monospace";
      this.ctx.fillStyle = "white";
      this.ctx.lineWidth = 8
      this.ctx.strokeStyle = "black"
      this.ctx.strokeText(this.char, this.x, this.y), 200;
      this.ctx.fillText(this.char, this.x, this.y);
  }

  move() {
      this.x += this.vx;
  }
}
