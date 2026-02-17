import Invader from "./invader.js";

class Grid{
    constructor(rows,cols) {
        this.rows = rows;
        this.cols = cols;
        this.direction = "right"
        this.moveDown = false;
        this.invadersVelocity = 1;
        this.invaders = this.init();
    }

    init(){
        const array = [];

        for (let row = 0; row < this.rows; row+=1) {
            for (let col = 0; col < this.cols; col+=1){
              const invader = new Invader({
                x: col *50 +20,
                y: row *37 + 80
                }, this.invadersVelocity
            );
            array.push(invader);
                

               

            }
        }
        return array;

    }

    draw(ctx) {
        this.invaders.forEach((invader) => {
            invader.draw(ctx);
        });
    }

    update(playerStatus){
        if (this.reachedRightBoundary()){
           this.direction = "left";
            this.moveDown = true;
        }

        else if (this.reachedLeftBoundary()){
            this.direction = "right";
            this.moveDown = true;
        }

        if (!playerStatus) this.moveDown = false;


         this.invaders.forEach((invader) => {

        if (this.moveDown) {
            invader.movedown();
            invader.incrementVelocity(0.1);
            this.invadersVelocity = invader.velocity; 
        }

        // Move para os lados
        if (this.direction === "right") {
            invader.moveright();
        } else {
            invader.moveleft();
        }
    });

        this.moveDown = false;
      
    }


    reachedRightBoundary(){
        return this.invaders.some((invader) => {
        return invader.position.x + invader.width >= innerWidth;
        });
    }

     reachedLeftBoundary(){
        return this.invaders.some((invader) => {
        return invader.position.x <= 0
        });
     }

    getRamdomInvader() {
    if (this.invaders.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.invaders.length);
    return this.invaders[randomIndex];
}
    
restart(){
    this.invaders = this.init();
    this.direction = "right";
}

}
    


export default Grid;