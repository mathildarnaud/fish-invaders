const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1000
canvas.height = 500

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  })();
  //The initial angle is 0
  let step = 0;
  //Define the colors of three waves
  let lines = ["rgba(6, 0, 77, 0.2)",
                 "rgba(64, 30, 203, 0.2)",
                 "rgba(121, 150, 236, 0.2)"];
  function loop(){
      c.clearRect(0,0,canvas.width,canvas.height);
      step++;
      //Draw 3 rectangles with different colors
      for(let j = lines.length-1; j >= 0; j--) {
          c.fillStyle = lines[j];
          //The angle of each rectangle is different, the difference between each is 45 degrees
          let angle = (step+j*45)*Math.PI/180;
          let deltaHeight = Math.sin(angle) * 50;
          let deltaHeightRight = Math.cos(angle) * 50;
          c.beginPath();-
          c.moveTo(0, canvas.height/2+deltaHeight);
          c.bezierCurveTo(canvas.width /2, canvas.height/2+deltaHeight-50, canvas.width / 2, canvas.height/2+deltaHeightRight-50, canvas.width, canvas.height/2+deltaHeightRight);
          c.lineTo(canvas.width, canvas.height);
          c.lineTo(1, canvas.height);
          c.lineTo(1, canvas.height/2+deltaHeight);
          c.closePath();
          c.fill();
      }
      requestAnimFrame(loop);
  }
  loop();

class Player {
  constructor() {

    this.velocity = {
      x: 0,
      y: 0
    }
    this.opacity = 1
    this.rotation = 0


    const image = new Image()
    image.src = './img/crabe-a.png'
    image.onload = () => {
      this.image = image
      const scale = 0.8
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    // if (this.image)
    c.save()
    c.globalAlpha = this.opacity
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    )

    c.rotate(this.rotation)

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    )

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )

    c.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}




class Projectile {
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity

    this.radius = 4
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = '#FC5426'
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}


class Particule {
  constructor({position, velocity, radius, color, fades}){
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades =  fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.fades)
    this.opacity -= 0.01
  }
}


class InvaderProjectile {
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity

    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = '#FFDFB6'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}


class Invader {
  constructor({position}) {

    this.velocity = {
      x: 0,
      y: 0
    }


    const image = new Image()
    image.src = './img/fish-a.png'
    image.onload = () => {
      this.image = image
      const scale = 0.5
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    // if (this.image)

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    )

  }

  update({velocity}) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile( {
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: {
          x: 0,
          y: 5
        }
      })
    )
  }
}


class Grid {
  constructor () {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 3,
      y: 0
    }
    this.invaders = []
    // this.invaders = [new Invader()]

    const rows = Math.floor(Math.random() * 5 + 2)
    const columns = Math.floor(Math.random() * 8 + 5)

    this.width = columns * 42

    for (let x=0; x < columns; x++) {
      for (let y=0; y < rows; y++) {
        this.invaders.push(new Invader({
          position: {
            x: x * 42,
            y: y * 32
          }
        }))
      }
    }
  }
  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 32
    }
  }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particules = []
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  },
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
console.log(randomInterval)
let game = {
  over: false,
  active: true
}
let score = 0
let myAudio = document.querySelector('#audio')
let myAudio2 = document.querySelector('#audio2')
// for (let i = 0; i < 100; i++) {
//   particules.push(
//     new Particule( {
//     position: {
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height
//     },
//     velocity: {
//       x: 0,
//       y: 0.3
//     },
//     radius: Math.random() * 2,
//     color: '#7996EC'
//   }))
// }

function createParticules({object, color, fades}) {
  for (let i = 0; i < 10; i++) {
    particules.push(
      new Particule( {
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
      },
      velocity: {
        x: (Math.random() - 0.5) *2,
        y: (Math.random() - 0.5) *2
      },
      radius: Math.random() * 3,
      color: color || '#FC5426',
      fades : fades
    }))
  }
}

function animate() {
  if (!game.active) return
  requestAnimationFrame(animate)
  // c.fillStyle = '#06004D'
  // c.globalAlpha = 0.0
  c.fillRect(0, 0, canvas.width, canvas.height)
  // invader.update()
  player.update()

  particules.forEach((particule, i) => {

    if(particule.position.y - particule.radius >= canvas.height) {
      particule.position.x = Math.random() * canvas.width
      particule.position.y = particule.radius
    }
    if (particule.opacity <= 0) {
      setTimeout(() => {
        particules.splice(i, 1)

      }, 0);
    } else {
      particule.update()
    }
  })

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (invaderProjectile.position.y + invaderProjectile.height
      >= canvas.height) {
        setTimeout(() => {
          invaderProjectiles.splice(index, 1)
        }, 0);
    } else invaderProjectile.update()

    if (invaderProjectile.position.y + invaderProjectile.height
      >= player.position.y
      && invaderProjectile.position.x +
      invaderProjectile.width >= player.position.x
       && invaderProjectile.position.x <=
      player.position.x + player.width
      ) {
        console.log('you lose')
        // document.write("you lose");
        messageEl.innerHTML = 'Oh no ... You lose'
        myAudio2.play()
        setTimeout(() => {
          invaderProjectiles.splice(index, 1)
          player.opacity = 0
          game.over = true
        }, 0);

        setTimeout(() => {
          // game.active = false
          location.reload()
        }, 1000);

        createParticules({
          object: player,
          color: '#FFDFB6',
          fades: true
        })
      }
  })


  projectiles.forEach((projectile, index)=> {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0);
    } else {
      projectile.update()
    }
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()

  //spawn projectilse
  if (frames % 100 === 0 && grid.invaders.length > 0) {
    grid.invaders[Math.floor(Math.random() *
      grid.invaders.length)].shoot(invaderProjectiles)
  }

    grid.invaders.forEach((invader, i) => {
      invader.update({velocity: grid.velocity})

  //projectiles hit ennemy
      projectiles.forEach((projectile, j) => {
        if(
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >=
            invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >=
            invader.position.y
          ) {



            setTimeout(() => {
              const invaderFound = grid.invaders.find(
                (invader2) => invader2 === invader
              )
              const projectileFound = projectiles.find(
                (projectile2) => projectile2 === projectile
              )

// remove invader and projectile
              if (invaderFound && projectileFound) {
                score += 100
                scoreEl.innerHTML = score
                messageEl.innerHTML = 'Nice shoot !'

                myAudio.play()
              // createParticules({
              //   object: invader,
              //   color: '#FC5426',
              //   fades: true
              // })

                grid.invaders.splice(i, 1)
                projectiles.splice(j, 1)

                if (grid.invaders.length > 0) {
                  const firstInvader = grid.invaders[0]
                  const lastInvader = grid.invaders[grid.
                    invaders.length - 1]

                    grid.width =
                      lastInvader.position.x -
                      firstInvader.position.x +
                      lastInvader.width
                    grid.position.x = firstInvader.position.x
                } else {
                  grids.splice(gridIndex, 1)
                }
              } else {
                messageEl.innerHTML = 'Try to shoot a fish'

              }
            }, 0)
        }
      })

    })
  })

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7
    player.rotation = -0.15
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
    ) {
      player.velocity.x = 7
      player.rotation = 0.15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  // console.log(frames)
  //spawning ennemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid())
    frames = 0
    randomInterval = Math.floor(Math.random() * 500 + 500)
    console.log(randomInterval)
  }


  frames++

}

animate()

addEventListener('keydown', ({key}) => {
  if (game.over) return
  // console.log(key)
  switch (key) {
    case "ArrowLeft":
      keys.a.pressed = true
      break;
    case "ArrowRight":
      // console.log('right')
      keys.d.pressed = true
      break;
    case ' ':
      // console.log('space')
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10
          }
        })
      )
      break;
    }
  }
)
addEventListener('keyup', ({key}) => {
  // console.log(key)
  switch (key) {
    case "ArrowLeft":
      keys.a.pressed = false
      break;
    case "ArrowRight":
      // console.log('right')
      keys.d.pressed = false
      break;
    case ' ':
      // console.log('space')
      break;
    }
  }
)


window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})
