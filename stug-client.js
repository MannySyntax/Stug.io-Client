// ==UserScript==
// @name         STUG.IO Client
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Most advanced STUG.IO Hack
// @author       MannyCodes
// @match        https://stug.io/*
// @icon         https://i.ibb.co/SnQt7Vh/download.jpg
// @run-at       document-end
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// ==/UserScript==

const stugClientHTML = `
<div class="stug-client" id="draggable-stug-client">
  <span id="stug-client-header">STUG.IO Client</span>
  <span id="stug-client-zoom">Zoom</span>
  <span id="stug-client-aimbot">Aimbot</span>
  <span id="stug-client-autoclick">AutoClick</span>
  <span id="stug-client-autochat">AutoChat</span>
  <input placeholder="Message Here" id="stug-client-msg" type="text">
</div>
`;

const stugClientStyles = `
<style>
  .stug-client {
    color: white;
    font-family: "Lilita One", sans-serif;
    border-radius: 50px;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 9999;
  }

  #stug-client-header {
    display: block;
    width: 300px;
    font-size: 30px;
    background-color: #201c1c;
    padding: 5px 20px 5px 5px;
    border-radius: 10px 10px 0px 0px;
  }

  #stug-client-zoom,
  #stug-client-aimbot,
  #stug-client-autoclick,
  #stug-client-autochat {
    display: block;
    width: 300px;
    font-size: 30px;
    color: white;
    background-color: #302c24;
    padding: 5px 20px 5px 10px;
    cursor: pointer;
    text-align: left !important;
  }

  #stug-client-msg {
    width: 150px;
    position: relative;
    bottom: 30px;
    left: 100px;
    background-color: transparent;
    color: white;
    border: 5px;
  }

  #stug-client-autochat {
    border-radius: 0px 0px 10px 10px;
  }

  #stug-client-zoom:hover,
  #stug-client-aimbot:hover,
  #stug-client-autoclick:hover,
  #stug-client-autochat:hover {
    background-color: #1c50c4;
  }
</style>
`;

const $ = window.jQuery;

$(document.body).append(stugClientHTML);
$(document.body).append(stugClientStyles);

const stugClient = document.getElementById("draggable-stug-client");
let offsetX, offsetY, isDragging = false;

stugClient.addEventListener("mousedown", (event) => {
  isDragging = true;
  offsetX = event.clientX - stugClient.offsetLeft;
  offsetY = event.clientY - stugClient.offsetTop;
});

document.addEventListener("mousemove", (event) => {
  if (isDragging) {
    stugClient.style.left = event.clientX - offsetX + "px";
    stugClient.style.top = event.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Zoom
let zoomEnabled = false;

function zoom(event) {
    console.log(`Delta Y: ${event.deltaY}`);
    // Change Zoom
    if (event.deltaY > 0) {
        // Check if player is zoomed out too much
        // Only works for full screen rn
        if (game.camera.zoom <= 0.33999999999999964) {
            return;
        }
        game.camera.zoom -= 0.01;
    } else {
        game.camera.zoom += 0.01;
    }
}

// Control zoom by using scroll wheel
function toggleZoom() {
    zoomEnabled = !zoomEnabled;
    zoomEnabled ? console.log('Enabling Zoom.') : console.log('Disabling Zoom.');

    if (zoomEnabled) {
        document.addEventListener('wheel', zoom);
    } else {
        document.removeEventListener('wheel', zoom);
    }
}

document.getElementById('stug-client-zoom').addEventListener('click', () => {
  toggleZoom();
  if (zoomEnabled) {
    document.getElementById('stug-client-zoom').style.backgroundColor = '#b804ec';
  } else {
    document.getElementById('stug-client-zoom').style.backgroundColor = '#302c24';
  }
});

// Aimbot
let aimbotEnabled = false;
let myPlr;
let targetPlayerIndex;
let targetPlayerInterval;
const targetPlayerDelay = 0;
let findPlayerInterval;
const findPlayerDelay = 1000;
let firstPlayerIndex;
let closestPlrIndex; // Check if the x and y is closer if so closest
let closestPlrDistance;
let players = [];

// PixiJS Graphics object for drawing the line
let lineGraphics;

function toggleAimbot() {
  aimbotEnabled = !aimbotEnabled;
  aimbotEnabled ? console.log('Enabling Aimbot.') : console.log('Disabling Aimbot.');

  if (aimbotEnabled) {
    // Find player
    findPlayerInterval = setInterval(() => {
      for (let i = 0; i < game.app.cstage.children.length - 1; i++) {
        if (game.app.cstage.children[i].subtype === 'tank') {
          if (game.app.cstage.children[i].netData.name === undefined) {
            continue;
          }
          if (game.app.cstage.children[i].netData.name === game.appComponent.currentUser.name) {
            myPlr = game.app.cstage.children[i];
            console.log(myPlr);
            console.log(`Found client ${myPlr.netData.name}`);
          } else {
            players.push(game.app.cstage.children[i]);
            console.log(`Found ${game.app.cstage.children[i].netData.name}`);
          }
        }
      }
      for (let i = 0; i < players.length - 1; i++) {
        const myPlrX = myPlr.x;
        const myPlrY = myPlr.y;
        const enemyX = players[i].x;
        const enemyY = players[i].y;
        console.log(`${myPlr.netData.name}: X:${myPlrX} Y:${myPlrY}`);
        console.log(`${players[i].netData.name} X:${players[i].x} Y:${players[i].y}`);

        if (i === 0) {
          closestPlrIndex = 0;
          closestPlrDistance = Math.sqrt(Math.pow(enemyX - myPlrX, 2) + Math.pow(enemyY - myPlrY, 2));
        } else {
          const otherPlrDistance = Math.sqrt(Math.pow(enemyX - myPlrX, 2) + Math.pow(enemyY - myPlrY, 2));
          if (otherPlrDistance < closestPlrDistance) {
            closestPlrIndex = i;
            closestPlrDistance = otherPlrDistance;
          }
        }
      }
      console.log(`${players[closestPlrIndex].netData.name} is the closest player to you.`);
    }, findPlayerDelay);

    // Target Player Interval
    targetPlayerInterval = setInterval(() => {
      const targetPlr = players[closestPlrIndex];
      const diffX = targetPlr.x - myPlr.x;
      const diffY = targetPlr.y - myPlr.y;
      const angle = Math.atan2(diffY, diffX);
      console.log(`Angle:${angle}`);
      game.mainSocket.emit('targetAngle', angle);

      if (!lineGraphics) {
        lineGraphics = new PIXI.Graphics();
        lineGraphics.getZIndex = function() {
          return -1;
        }
        game.app.cstage.addChild(lineGraphics);
      } else {
        lineGraphics.clear();
      }
      lineGraphics.lineStyle(2, 0xff0000); 
      lineGraphics.moveTo(myPlr.x, myPlr.y);
      lineGraphics.lineTo(targetPlr.x, targetPlr.y);
    }, targetPlayerDelay);
  } else {
    if (lineGraphics) {
      lineGraphics.clear();
      game.app.cstage.removeChild(lineGraphics);
      lineGraphics = null;
    }
    clearInterval(findPlayerInterval);
    clearInterval(targetPlayerInterval);
  }
}

document.getElementById('stug-client-aimbot').addEventListener('click', () => {
  toggleAimbot();
  if (aimbotEnabled) {
    document.getElementById('stug-client-aimbot').style.backgroundColor = '#b804ec';
  } else {
    document.getElementById('stug-client-aimbot').style.backgroundColor = '#302c24';
  }
});

// Autoclick
let autoClickEnabled = false;
let autoClickInterval;
const autoClickIntervalDelay = 100;

function toggleAutoClick() {
    autoClickEnabled = !autoClickEnabled;
    autoClickEnabled ? console.log('Enabling AutoClick.') : console.log('Disabling AutoClick.');

    if (autoClickEnabled) {
        autoClickInterval = setInterval(() => {
            game.mainSocket.emit('fire');
        }, autoClickIntervalDelay);
    } else {
        clearInterval(autoClickInterval);
    }
}

document.getElementById('stug-client-autoclick').addEventListener('click', () => {
  toggleAutoClick();
  if (autoClickEnabled) {
    document.getElementById('stug-client-autoclick').style.backgroundColor = '#b804ec';
  } else {
    document.getElementById('stug-client-autoclick').style.backgroundColor = '#302c24';
  }
});

// Autochat
let autoChatEnabled = false;
let autoChatInterval;
const autoChatIntervalDelay = 1000;

function toggleAutoChat(msg) {
    autoChatEnabled = !autoChatEnabled;
    autoChatEnabled ? console.log('Enabling Auto Chat.') : console.log('Disabling Auto Chat.');

    if (autoChatEnabled) {
        autoChatInterval = setInterval(() => {
            game.lobbyChat.component.chatMessage = msg;
            game.lobbyChat.component.sendChat();
        }, autoChatIntervalDelay);
    } else {
        clearInterval(autoChatInterval);
    }
}

document.getElementById('stug-client-autochat').addEventListener('click', () => {
  const autoChatMessage = document.getElementById('stug-client-msg').value;
  toggleAutoChat(autoChatMessage);
  if (autoChatEnabled) {
    document.getElementById('stug-client-autochat').style.backgroundColor = '#b804ec';
  } else {
    document.getElementById('stug-client-autochat').style.backgroundColor = '#302c24';
  }
});
