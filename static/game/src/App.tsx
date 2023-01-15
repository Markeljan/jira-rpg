import React, { useEffect, useState, useRef } from "react";
import { invoke } from "@forge/bridge";
import kaboom from "kaboom";

function App() {
  const [data, setData] = useState(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    invoke("getText").then((data) => {
      setData(data);
    });
    console.log("data", data);

    kaboom({
      canvas: canvasRef.current,
      scale: 4,
      width: 144,
      height: 144,
    });

    loadSprite("wall", "./sprites/tiles/wall.png");
    loadSprite("door", "./sprites/tiles/door.png");
    loadSprite("key", "./sprites/objects/key.png");
    loadSprite("player", "./sprites/characters/player.png", {
      sliceX: 2,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 1,
          loop: true,
          speed: 1,
        },
      },
    });
    loadSprite("devil", "./sprites/characters/devil.png", {
      sliceX: 2,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 1,
          loop: true,
          speed: 1,
        },
      },
    });
    loadSprite("orc", "./sprites/characters/orc.png", {
      sliceX: 2,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 1,
          loop: true,
          speed: 1,
        },
      },
    });
    loadSpriteAtlas("./sprites/atlas/Floor.png", {
      floor: {
        x: 272,
        y: 0,
        width: 48,
        height: 48,
        sliceX: 3,
        sliceY: 3,
      },
    });

    scene("main", (levelIdx) => {
      layers(["bg", "game", "ui"], "game");

      const SPEED = 80;

      const characters = {
        a: {
          sprite: "orc",
          msg: "Errrgh!",
        },
        b: {
          sprite: "devil",
          msg: "Get out!",
        },
      };

      //floor tiles
      addLevel(
        [
          "         ",
          "         ",
          "         ",
          "         ",
          "         ",
          "         ",
          "         ",
          "         ",
          "         ",
        ],
        {
          width: 16,
          height: 16,
          " ": () => [sprite("floor", { frame: ~~rand(0, 8) })],
        }
      );

      const levels = [generateLevel(), generateLevel(), generateLevel(), generateLevel()];
      function generateLevel() {
        // Initialize the level as a 9x9 grid of walls
        let level = [
          "=========",
          "=       =",
          "=       =",
          "=       =",
          "=       =",
          "=       =",
          "=       =",
          "=       =",
          "=========",
        ];
        let wallPositions = [];

        // Populate the array with all positions of the walls except the corners
        for (let x = 0; x < 9; x++) {
          for (let y = 0; y < 9; y++) {
            if (
              (x > 0 && x < 8 && y > 0 && y < 8) ||
              (x === 0 && y === 0) ||
              (x === 8 && y === 0) ||
              (x === 0 && y === 8) ||
              (x === 8 && y === 8)
            ) {
              continue;
            } else {
              wallPositions.push([x, y]);
            }
          }
        }

        // Randomly select a wall to replace with the door
        let doorPos = wallPositions.splice(Math.floor(Math.random() * wallPositions.length), 1)[0];

        // Replace the wall with the door
        level[doorPos[0]] =
          level[doorPos[0]].substring(0, doorPos[1]) +
          "|" +
          level[doorPos[0]].substring(doorPos[1] + 1);

        // Create an array to store the available positions for each tile
        let availablePositions = [];

        // Populate the array with all positions inside the level (excluding outer ring)
        for (let i = 1; i < 8; i++) {
          for (let j = 1; j < 8; j++) {
            availablePositions.push([i, j]);
          }
        }

        // Randomly select a position for the key
        let keyPos = availablePositions.splice(
          Math.floor(Math.random() * availablePositions.length),
          1
        )[0];
        // Add the key to the level
        level[keyPos[1]] =
          level[keyPos[1]].substring(0, keyPos[0]) +
          "$" +
          level[keyPos[1]].substring(keyPos[0] + 1);

        // Create an array of all adjacent positions to the key
        let adjacentPositions = [
          [keyPos[0], keyPos[1] - 1],
          [keyPos[0] - 1, keyPos[1]],
          [keyPos[0], keyPos[1] + 1],
          [keyPos[0] + 1, keyPos[1]],
        ];
        let adjacents = adjacentPositions.filter((pos) =>
          availablePositions.some((p) => p[0] === pos[0] && p[1] === pos[1])
        );
        let charPos = adjacents[Math.floor(Math.random() * adjacents.length)];
        // Remove the chosen position from the available positions
        availablePositions = availablePositions.filter(
          (p) => !(p[0] === charPos[0] && p[1] === charPos[1])
        );

        level[charPos[1]] =
          level[charPos[1]].substring(0, charPos[0]) +
          (Math.random() < 0.5 ? "a" : "b") +
          level[charPos[1]].substring(charPos[0] + 1);
        availablePositions = availablePositions.filter(
          (p) => !(p[0] === charPos[0] && p[1] === charPos[1])
        );

        // Randomly select a position for the player
        let playerPos = availablePositions.splice(
          Math.floor(Math.random() * availablePositions.length),
          1
        )[0];
        // Add the player to the level
        level[playerPos[1]] =
          level[playerPos[1]].substring(0, playerPos[0]) +
          "@" +
          level[playerPos[1]].substring(playerPos[0] + 1);

        return level;
      }
      addLevel(levels[levelIdx], {
        width: 16,
        height: 16,
        // "=": () => [sprite("wall"), area(), solid(), "wall"],
        // $: () => [sprite("key"), area(), "key"],
        "@": () => [sprite("player"), area(), solid(), "player"],
        // "|": () => [sprite("door"), area(), solid(), "door"],

        any(ch) {
          const char = characters[ch];
          if (char) {
            return [sprite(char.sprite), area(), solid(), "character", { msg: char.msg }];
          }
        },
      });

      const player = get("player")[0];
      player.play("idle");

      get("character").forEach((c) => c.play("idle"));

      function addDialog() {
        const h = 160;
        const pad = 16;
        const bg = add([
          pos(0, height() - h),
          rect(width(), h),
          color(0, 0, 0),
          z(10),
          opacity(0.5),
        ]);
        const txt = add([
          text("", {
            width: width(),
          }),
          pos(0 + pad, height() - h + pad),
          z(100),
        ]);
        bg.hidden = true;
        txt.hidden = true;
        return {
          say(t) {
            txt.text = t;
            bg.hidden = false;
            txt.hidden = false;
          },
          dismiss() {
            if (!this.active()) {
              return;
            }
            txt.text = "";
            bg.hidden = true;
            txt.hidden = true;
          },
          active() {
            return !bg.hidden;
          },
          destroy() {
            bg.destroy();
            txt.destroy();
          },
        };
      }

      let hasKey = false;
      const dialog = addDialog();

      player.onCollide("key", (key) => {
        destroy(key);
        hasKey = true;
      });

      player.onCollide("door", () => {
        if (hasKey) {
          if (levelIdx + 1 < levels.length) {
            go("main", levelIdx + 1);
          } else {
            go("win");
          }
        } else {
          dialog.say("It's locked!");
        }
      });

      player.onCollide("character", (ch) => {
        //if jira task is done, delete character and show message you lost

        //else deleate character
        destroy(ch);
      });

      const dirs = {
        left: LEFT,
        right: RIGHT,
        up: UP,
        down: DOWN,
      };

      for (const dir in dirs) {
        onKeyPress(dir as any, () => {
          dialog.dismiss();
        });
        onKeyDown(dir as any, () => {
          player.move(dirs[dir].scale(SPEED));
          player.stop("idle");
        });
        onKeyRelease(dir as any, () => {
          player.play("idle");
        });
      }
    });

    scene("win", () => {
      add([text("You Win!"), pos(width() / 2 - 180, height() / 2 - 40)]);
    });

    go("main", 0);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas ref={canvasRef}></canvas>;
    </div>
  );
}

export default App;
