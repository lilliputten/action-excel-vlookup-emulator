export interface TInitOptions {
  frequency?: number;
  launch_speed?: number;
  launch_particles_size?: number;
  debris_num?: number;
  rockets_num?: number;
  // explode_debris_num?: number;
  // explode_particles_size: number;
  explode_particles_resistance?: number;
  width?: number;
  height?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  zIndex?: number;
}

interface TOpt {
  explode_debris_num?: number;
  explode_particles_resistance?: number;
  explode_particles_size?: number;
  frequency?: number;
  launch_particles_size?: number;
  launch_speed?: number;
}

type TCssPos = number | string;

let MAX_ROCKETS = 4;

let MAX_PARTICLES: number = 0;

// Creating variables
let SCREEN_X: number | undefined;
let SCREEN_Y: number | undefined;

let isContinuous = false;

let SCREEN_WIDTH: number = 0;
let SCREEN_HEIGHT: number = 0;

let fireworksField: HTMLElement | null;
const opt: TOpt = {};
let particles: Particle[] = [];
let rockets: Rocket[] = [];
let SCREEN_TOP: TCssPos;
let SCREEN_BOTTOM: TCssPos;
let SCREEN_LEFT: TCssPos;
let SCREEN_RIGHT: TCssPos;
let Z_INDEX: number;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D | null;

let reloadTimer: NodeJS.Timeout | undefined;
let loopTimer: NodeJS.Timeout | undefined;

interface TPos {
  x: number; // TCssPos;
  y: number; // TCssPos;
}

function toNumber(n?: string | number) {
  return n ? (typeof n === 'string' ? parseInt(n) : n) : 0;
}

class Particle {
  pos: TPos;
  vel: TPos;
  shrink: number;
  size: number;
  resistance: number;
  gravity: number;
  flick: boolean;
  alpha: number;
  fade: number;
  color: number;

  constructor(pos: TPos) {
    this.pos = {
      x: pos ? pos.x : 0,
      y: pos ? pos.y : 0,
    };
    this.vel = {
      x: 0,
      y: 0,
    };
    this.shrink = 0.97;
    this.size = 2;
    this.resistance = 1;
    this.gravity = 0;
    this.flick = false;
    this.alpha = 1;
    this.fade = 0;
    this.color = 0;
  }

  update() {
    // apply resistance
    this.vel.x *= this.resistance;
    this.vel.y *= this.resistance;
    // gravity down
    this.vel.y += this.gravity;
    // update position based on speed
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    // shrink
    this.size *= this.shrink;
    // fade out
    this.alpha -= this.fade;
  }

  render(c?: CanvasRenderingContext2D) {
    if (!c || !this.exists()) {
      return;
    }
    c.save();
    c.globalCompositeOperation = 'lighter';
    const x = this.pos.x;
    const y = this.pos.y;
    const r = this.size / 2;
    const color = this.color;
    const gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, 'rgba(255,255,255,' + this.alpha + ')');
    gradient.addColorStop(0.8, 'hsla(' + color + ', 100%, 50%, ' + this.alpha + ')');
    gradient.addColorStop(1, 'hsla(' + color + ', 100%, 50%, 0.1)');
    c.fillStyle = gradient;
    c.beginPath();
    c.arc(
      this.pos.x,
      this.pos.y,
      this.flick ? Math.random() * this.size : this.size,
      0,
      Math.PI * 2,
      true,
    );
    c.closePath();
    c.fill();
    c.restore();
  }

  exists() {
    return this.alpha >= 0.1 && this.size >= 1;
  }
}

class Rocket extends Particle {
  explosionColor: number;

  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
    });
    this.explosionColor = 0;
  }

  explode() {
    // Exploding particles count
    for (let i = 0; i < toNumber(opt.explode_debris_num); i++) {
      const particle = new Particle(this.pos);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.cos((Math.random() * Math.PI) / 2) * 15;
      particle.vel.x = Math.cos(angle) * speed;
      particle.vel.y = Math.sin(angle) * speed;
      particle.size = opt.explode_particles_size || 0;
      particle.gravity = 0.2;
      particle.resistance = 0.9 + (opt.explode_particles_resistance || 0) * 0.01;
      particle.shrink = Math.random() * 0.4 + 0.6; // 0.95;
      particle.flick = true;
      particle.color = this.explosionColor;
      particles.push(particle);
    }
  }

  render(c?: CanvasRenderingContext2D) {
    if (!c || !this.exists()) {
      return;
    }
    c.save();
    c.globalCompositeOperation = 'lighter';
    const x = this.pos.x,
      y = this.pos.y,
      r = this.size / 2;
    const gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, 'rgba(255, 255, 255 ,' + this.alpha + ')');
    gradient.addColorStop(1, 'rgba(0, 0, 0, ' + this.alpha + ')');
    c.fillStyle = gradient;
    c.beginPath();
    c.arc(
      this.pos.x,
      this.pos.y,
      this.flick ? (Math.random() * this.size) / 2 + this.size / 2 : this.size,
      0,
      Math.PI * 2,
      true,
    );
    c.closePath();
    c.fill();
    c.restore();
  }
}

export const Fireworks = {
  init: function (dom: string, options: TInitOptions) {
    if (!dom || typeof dom !== 'string' || document.getElementById(dom) == null) {
      // eslint-disable-next-line no-console
      console.log('Expected DOM node identifier');
    } else {
      fireworksField = document.getElementById(dom);
      if (options.rockets_num) {
        MAX_ROCKETS = options.rockets_num;
      }
      opt.frequency = options.frequency || 200;
      opt.launch_speed = options.launch_speed || 12;
      opt.launch_particles_size = options.launch_particles_size || 0;
      opt.explode_debris_num = Math.random() * 10 + (options.debris_num || 150);
      opt.explode_particles_resistance = options.explode_particles_resistance || 5;
      opt.explode_particles_size = options.explode_particles_resistance || 10;
      SCREEN_TOP = options.top || '0px';
      SCREEN_BOTTOM = options.bottom || '0px';
      SCREEN_LEFT = options.left || '0px';
      SCREEN_RIGHT = options.right || '0px';
      Z_INDEX = options.zIndex || 100;
      MAX_PARTICLES = opt.explode_debris_num * 10;

      canvas = document.createElement('canvas');
      canvas.id = 'fireworksField';

      canvas.style.position = 'absolute';
      canvas.style.top = SCREEN_TOP;
      canvas.style.bottom = SCREEN_BOTTOM;
      canvas.style.left = SCREEN_LEFT;
      canvas.style.right = SCREEN_RIGHT;
      canvas.style.opacity = '1';
      canvas.style.zIndex = String(Z_INDEX);
      canvas.style.transition = 'opacity 1000ms';
      context = canvas.getContext('2d');

      fireworksField?.appendChild(canvas);

      // Set width/height
      const setDimensions = () => {
        const width = options.width || window.innerWidth;
        const height = options.height || window.innerHeight;
        SCREEN_WIDTH = width;
        SCREEN_HEIGHT = height;
        canvas.style.width = SCREEN_WIDTH + 'px';
        canvas.style.height = SCREEN_HEIGHT + 'px';
        canvas.width = width;
        canvas.height = height;
      };
      setDimensions();
      window.addEventListener('resize', setDimensions);
    }
  },

  createRocket: function () {
    const x = SCREEN_X != undefined ? SCREEN_X : SCREEN_WIDTH / 2;
    const y = SCREEN_Y != undefined ? SCREEN_Y : SCREEN_HEIGHT / 2;
    const count = this.loopCount + 1;
    const maxOffset = this.loopCount ? 20 : 40;
    const rocket = new Rocket(
      x + Math.round((Math.random() - 0.5) * maxOffset * count),
      y + Math.round((Math.random() - 0.5) * maxOffset * count),
    );
    rocket.explosionColor = Math.floor((Math.random() * 360) / 10) * 10;
    rocket.vel.y = -1 * toNumber(opt.launch_speed);
    rocket.vel.x = Math.random() * 2 - 1;
    rocket.size = toNumber(opt.launch_particles_size);
    rocket.shrink = 1.008;
    rocket.gravity = 0.005;
    return rocket;
  },

  initRockets() {
    for (let i = rockets.length; i < MAX_ROCKETS; i++) {
      const rocket = this.createRocket();
      rockets.push(rocket);
      rocket.explode();
    }
  },

  reload: function () {
    if (isContinuous && rockets.length < MAX_ROCKETS) {
      rockets.push(this.createRocket());
    }
  },

  loopCount: 0,
  loop: function () {
    const width = canvas.width;
    const height = canvas.height;

    if (context) {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.clearRect(0, 0, width, height);
    }

    const existingRockets = [];
    for (let i = 0; i < rockets.length; i++) {
      rockets[i].update();
      if (context) {
        rockets[i].render(context);
      }
      const distance = Math.sqrt(
        Math.pow(width - rockets[i].pos.x, 2) + Math.pow(height - rockets[i].pos.y, 2),
      );
      const randomChance = rockets[i].pos.y < (height * 2) / 3 ? Math.random() * 100 <= 1 : false;

      if (
        isContinuous &&
        (rockets[i].pos.y < height / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance)
      ) {
        rockets[i].explode();
      } else {
        existingRockets.push(rockets[i]);
      }
    }
    rockets = existingRockets;

    const existingParticles = [];
    for (let j = 0; j < particles.length; j++) {
      particles[j].update();
      if (particles[j].exists()) {
        if (context) {
          particles[j].render(context);
        }
        existingParticles.push(particles[j]);
      }
    }

    particles = existingParticles;
    while (particles.length > MAX_PARTICLES) {
      particles.shift();
    }

    ++this.loopCount; // DEBUG
  },

  start: function (x?: number, y?: number, continuous?: boolean) {
    this.loopCount = 0;
    SCREEN_X = x;
    SCREEN_Y = y;
    isContinuous = !!continuous;
    if (reloadTimer) {
      clearInterval(reloadTimer);
    }
    if (loopTimer) {
      clearInterval(loopTimer);
    }
    reloadTimer = setInterval(this.reload.bind(this), opt.frequency);
    loopTimer = setInterval(this.loop.bind(this), 100);
    this.initRockets();
    canvas.style.opacity = '1';
  },

  stop: function () {
    clearInterval(reloadTimer);
    reloadTimer = undefined;
    canvas.style.opacity = '0';
    clearInterval(loopTimer);
    loopTimer = undefined;
    rockets = [];
    particles = [];
  },
};
