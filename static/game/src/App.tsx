import React, { useEffect, useState, useRef } from "react";
import { requestJira } from "@forge/bridge";
import { ViewIssueModal } from "@forge/jira-bridge";
import kaboom from "kaboom";

function App() {
  const canvasRef = useRef(null);
  const [userIssues, setUserIssues] = useState(null);
  const [completedIssues, setCompletedIssues] = useState(null);
  const [activeMenu, setActiveMenu] = useState("quests");
  const [playerInfo, setPlayerInfo] = useState({
    name: "Player",
    level: 0,
    health: 0,
    attack: 0,
  });
  const [gameHealth, setGameHealth] = useState(1);

  const showViewIssueModal = (key) => {
    const viewIssueModal = new ViewIssueModal({
      context: {
        issueKey: key,
      },
    });
    viewIssueModal.open();
  };

  useEffect(() => {
    //get the users data
    async function fetchIssues() {
      const response = await requestJira(`/rest/api/3/search?jql=assignee=currentuser()`);
      const responseJson = await response.json();
      console.log("raw issues", responseJson.issues);

      const completedIssues = responseJson.issues.filter((issue) => {
        return issue.fields.status.name === "Done";
      });

      setPlayerInfo({
        name: responseJson.issues[0].fields.assignee.displayName.split(" ")[0],
        health: Math.floor((responseJson.issues.length / 3) * 10),
        attack: responseJson.issues.length * 2,
        level: completedIssues.length,
      });

      setGameHealth(Math.floor(responseJson.issues.length / 3));

      // rebuild the objects to only use the data we need
      const issues = responseJson.issues.map((issue) => {
        return {
          key: issue.key,
          summary: issue.fields.summary,
          description: issue.fields.description,
          status: issue.fields.status.name,
        };
      });
      setUserIssues(issues);
    }
    fetchIssues();
  }, []);

  useEffect(() => {
    if (userIssues) {
      kaboom({
        canvas: canvasRef.current,
        scale: 4,
        width: 144,
        height: 144,
      });

      setData("gameHealth", gameHealth);
      setData("gameScore", "0");

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
          x: 0,
          y: 272,
          width: 16,
          height: 16,
        },
      });
      loadSpriteAtlas("./sprites/atlas/Wall.png", {
        wall: {
          x: 0,
          y: 272,
          width: 16,
          height: 16,
        },
      });
      loadSpriteAtlas("./sprites/atlas/Door.png", {
        door: {
          x: 0,
          y: 0,
          width: 16,
          height: 16,
        },
      });
      loadSpriteAtlas("./sprites/atlas/Key.png", {
        key: {
          x: 0,
          y: 0,
          width: 16,
          height: 16,
        },
      });
      loadSpriteAtlas("./sprites/atlas/GUI.png", {
        heart: {
          x: 0,
          y: 16,
          width: 80,
          height: 16,
          sliceX: 5,
          sliceY: 1,
          anims: {
            hurt: {
              from: 0,
              to: 4,
              loop: false,
              speed: 3,
            },
            heal: {
              from: 4,
              to: 0,
              loop: false,
              speed: 3,
            },
          },
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
            " ": () => [sprite("floor")],
          }
        );

        function generateLevel(levelIdx) {
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
          let doorPos = wallPositions.splice(
            Math.floor(Math.random() * wallPositions.length),
            1
          )[0];

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

        const dungeon = addLevel(generateLevel(), {
          width: 16,
          height: 16,
          "=": () => [sprite("wall"), area(), solid(), "wall"],
          $: () => [sprite("key"), area(), "key"],
          "@": () => [sprite("player"), health(getData("gameHealth")), area(), solid(), "player"],
          "|": () => [sprite("door"), area(), solid(), "door"],

          any(ch) {
            const char = characters[ch];
            if (char) {
              return [sprite(char.sprite), area(), solid(), "character", { msg: char.msg }];
            }
          },
        });

        const player = get("player")[0];
        player.play("idle");

        //draw heart sprites on ui layer
        const hearts = [];
        for (let i = 0; i < getData("gameHealth"); i++) {
          hearts.push(add([sprite("heart"), pos(0 + i * 16, 0), z(100), "heart", { idx: i }]));
        }
        //draw the score on the ui layer
        const score = add([text(getData("gameScore"), { size: 16 }), pos(0, 112), z(100), "score"]);

        get("character").forEach((c) => c.play("idle"));

        function addDialog() {
          const h = 40;
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
              size: 16,
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
            setData("gameScore", Number(getData("gameScore", 0)) + 1);
            go("main", levelIdx + 1);
          } else {
            dialog.say("It's locked!");
          }
        });

        player.onCollide("character", (ch) => {
          player.hurt(1);
          //remove heart sprite
          const heart = get("heart").find((h) => h.idx === getData("gameHealth", 1) - 1);
          setData("gameHealth", getData("gameHealth", 1) - 1);
          console.log(getData("gameHealth", 1));
          heart.play("hurt");
          destroy(ch);
        });

        player.on("death", () => {
          destroy(player);
          go("lose");
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

      scene("lose", () => {
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
            " ": () => [sprite("floor")],
          }
        );
        // Add a background
        add([rect(width(), height()), color(0, 0, 0), opacity(0.5)]);
        // Add a text label
        add([
          pos(width() / 2 - 36, height() / 2 - 8),
          text(`Score:${getData("gameScore")}`, {
            size: 16,
          }),
        ]);
      });

      scene("win", () => {
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
            " ": () => [sprite("floor")],
          }
        );
        // Add a background
        add([rect(width(), height()), color(0, 0, 0), opacity(0.5)]);
        // Add a text label
        add([
          pos(width() / 2 - 36, height() / 2 - 8),
          text(`Score:${getData("gameScore")}`, {
            size: 16,
          }),
        ]);
      });

      go("main", 0);
    }
  }, [userIssues]);

  return (
    <div
      style={{
        backgroundColor: "#333",
        display: "flex",
        justifyContent: "space-between",
        padding: "60px",
      }}
    >
      <canvas ref={canvasRef}></canvas>
      <div style={{ backgroundColor: "#333", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => setActiveMenu("stats")}>Stats</button>
            <button onClick={() => setActiveMenu("quests")}>Active Quests</button>
            <button onClick={() => setActiveMenu("completed-quests")}>Completed Quests</button>
          </div>
          {activeMenu === "quests" && (
            <>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#fff",
                  marginBottom: "20px",
                }}
              >
                Active Quests
              </h1>
              {userIssues &&
                userIssues.map((issue) => {
                  if (issue.status === "In Progress") {
                    return (
                      <a
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => showViewIssueModal(issue.key)}
                      >
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            color: "#333",
                          }}
                        >
                          <div> {issue.key}</div>
                          <div> {issue.summary}</div>
                          <div> {issue.status.substring(12)}</div>
                        </div>
                      </a>
                    );
                  }
                })}
            </>
          )}

          {activeMenu === "stats" && (
            <>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#fff",
                  marginBottom: "20px",
                }}
              >
                Stats
              </h1>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  color: "#333",
                }}
              >
                {playerInfo && (
                  <>
                    <div>Name: {playerInfo.name}</div>
                    <div>Level: {playerInfo.level}</div>
                    <div>Health: {playerInfo.health}</div>
                    <div>Attack: {playerInfo.attack}</div>
                  </>
                )}
              </div>
            </>
          )}

          {activeMenu === "completed-quests" && (
            <>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#fff",
                  marginBottom: "20px",
                }}
              >
                Completed Quests
              </h1>
              {userIssues &&
                userIssues.map((issue) => {
                  if (issue.status === "Done") {
                    return (
                      <a
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => showViewIssueModal(issue.key)}
                      >
                        <div
                          style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            color: "#333",
                          }}
                        >
                          <div> {issue.key}</div>
                          <div> {issue.summary}</div>
                          <div> {issue.status.substring(12)}</div>
                        </div>
                      </a>
                    );
                  }
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
