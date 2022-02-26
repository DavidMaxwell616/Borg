const TITLE_WIDTH =145
const TITLE_HEIGHT = 141;

let player;
let cursors;
let levels;
let playIntro = true;
let score = 0;
let scoreText;
let lives = 300;
const BORGTIMERLENGTH = 100;
let livesText;
let level=10;
let levelText;
let title;
let startGame = false;
let splash;
let xStart = 40;
let yStart = 200;
let xScale = .9;
let yScale = .8;
let maxxdaddy;
let curScore = 0;
let textTimer;
let guards = [];
let BORG;
var borgYV = -5;
var borgYVV = 0;
var borgXStart = 40;
var borgYStart = 200;
var borgYPath = borgYStart;
let borgTimer = 500;
let showintro = 1;
let gameOver = false;
const DEAD = 0;
const ALIVE = 1;
const COLOR_WHITE = 'rgb(255,255,255)';
const GAME_FONT = 'Impact';
let levelBkgd;
let numGuards;
let guardsLeft;
let runTime = 0;
let textTiles;
let levelOver = false;
let levelOverTimer = 0;
let emitter;
let cat1;
let cat2;
let cat3;
let cat4;

let polys = [];
let polygons;

let playerXSpeed = 0;
let playerYSpeed = 0;
const textFrames = {
  ')': 8,
  '(': 9,
  '=': 10,
  '-': 11,
  '?': 12,
  '!!': 13,
  '!': 14,
  Z: 15,
  Y: 16,
  X: 17,
  W: 18,
  V: 19,
  U: 20,
  T: 21,
  S: 22,
  R: 23,
  Q: 24,
  P: 25,
  O: 26,
  N: 27,
  M: 28,
  L: 29,
  K: 30,
  J: 31,
  I: 32,
  H: 33,
  G: 34,
  F: 35,
  E: 36,
  D: 37,
  C: 38,
  B: 39,
  A: 40,
  9: 41,
  8: 42,
  7: 43,
  6: 44,
  5: 45,
  4: 46,
  3: 47,
  2: 48,
  1: 49,
  0: 50,
};
var mouseDown;
var arrows =new Array(4);
var arrowStats = [
  {
    angle: 0,
  yOffset: 20,
  xOffset: 630,
  direction:'right',
  },
  {
    angle: 90,
  yOffset: 30,
  xOffset: -20,
  direction:'down',
  }  ,
  {
    angle: 180,
  yOffset: 20,
  xOffset: 550,
  direction:'left',
  }  ,
  {
    angle: 270,
  yOffset: -30,
  xOffset: -20,
  direction:'up',
  }  
  ];
  var arrowDown=false;
  var level_9_top_wall;
  var level_9_bottom_wall;
var moveWall;
var boss;
var bossX;
var bossY;
const color = new Phaser.Display.Color();
var gameoverText;
var gameEnding = false;
var gameOverCountdown=0;