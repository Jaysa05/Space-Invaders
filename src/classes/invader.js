import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";


class Invader {
    constructor(position, velocity) {
        this.position = position;
        this.width = 50 * 0.8;
        this.height = 37 * 0.8;
        this.velocity = velocity;

      
    this.image = this.getImage(PATH_INVADER_IMAGE);
    }

    getImage(src) {
        const image = new Image();
        image.src = src;
        return image;
    
    }

    moveleft(){
        this.position.x -= this.velocity;
    }

    moveright(){
        this.position.x += this.velocity;
    }

    movedown(){
        this.position.y += this.height;
    }

    incrementVelocity(boost){
        this.velocity += boost;
    }

    draw(ctx) {

        if (!this.image.complete) return;

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }


   shoot(Projectiles){
    const p = new Projectile(
        {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height,
        }, 10 

     );
     Projectiles.push(p);
   }
    
   hit(projectile){
    return (
        projectile.position.x >= this.position.x &&
        projectile.position.x <= this.position.x + this.width &&
        projectile.position.y >= this.position.y &&
        projectile.position.y <= this.position.y + this.height
    )
   }

}


export default Invader;
