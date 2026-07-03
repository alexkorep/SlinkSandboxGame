const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const querystring = require("node:querystring");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, ".slink-data", "levels");
const HOST = process.env.HOST || "127.0.0.1";
const START_PORT = Number(process.env.PORT || 8000);
const FIELD_WIDTH = 100;
const FIELD_HEIGHT = 100;
const WORLD_TOP_HEIGHT = 0;
const WORLD_BOTTOM_HEIGHT = 10;
const DEFAULT_ITEMS = `${JSON.stringify(Array(13).fill(0))}, ${JSON.stringify(Array(13).fill(0))}`;

const B = {
  BLANK: "  ",
  STONE: "01",
  GROUND: "02",
  GROUNDGRASS: "03",
  BRIDGE: "04",
  FENCE: "06",
  APPLE: "07",
  BRICK: "08",
  TREE_LEAVES: "11",
  TREE_TRUNK: "12",
  DIAMOND_SMALL: "14",
  GRANITE: "15",
  CLAY: "16",
  SAND: "17",
  DARK_GROUND: "18",
};

const BRICK_HEIGHTS = [
  B.BLANK,
  B.BLANK,
  B.TREE_LEAVES,
  B.GROUND,
  B.BLANK,
  B.DARK_GROUND,
  B.BLANK,
  B.GROUND,
  B.GROUND,
  B.GROUND,
  B.BLANK,
  B.DARK_GROUND,
  B.BLANK,
  B.GROUND,
];

const PLANTS = [
  { code: B.APPLE, minZ: 0, maxZ: 3 },
  { code: B.TREE_TRUNK, minZ: 0, maxZ: 5 },
  { code: B.DIAMOND_SMALL, minZ: BRICK_HEIGHTS.length - 2, maxZ: BRICK_HEIGHTS.length },
];

const BLOCK_STRENGTH = new Map([
  [1, 50],
  [2, 10],
  [3, 10],
  [4, 20],
  [6, 30],
  [7, 20],
  [8, 60],
  [11, 5],
  [12, 30],
  [14, 30],
  [15, 90],
  [16, 50],
  [17, 20],
  [18, 0],
]);

const CASTS = new Map([
  [`${B.DIAMOND_SMALL}${B.GROUND}${B.DIAMOND_SMALL}`, `${B.DIAMOND_SMALL}${B.BRICK}${B.BLANK}`],
  [
    `${B.DIAMOND_SMALL}${B.TREE_TRUNK}${B.TREE_TRUNK}${B.TREE_TRUNK}${B.DIAMOND_SMALL}`,
    `${B.DIAMOND_SMALL}${B.BRIDGE}${B.BRIDGE}${B.BRIDGE}${B.DIAMOND_SMALL}`,
  ],
  [
    `${B.DIAMOND_SMALL}${B.TREE_TRUNK}${B.TREE_TRUNK}${B.DIAMOND_SMALL}`,
    `${B.DIAMOND_SMALL}${B.FENCE}${B.FENCE}${B.DIAMOND_SMALL}`,
  ],
]);

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
]);

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function sanitizeLevelId(value) {
  const cleaned = String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);
  return cleaned || crypto.randomUUID();
}

function levelFile(levelId) {
  return path.join(DATA_DIR, `${levelId}.json`);
}

function readStoredLevel(levelId) {
  try {
    return JSON.parse(fs.readFileSync(levelFile(levelId), "utf8"));
  } catch {
    return null;
  }
}

function writeStoredLevel(levelId, data, items = "") {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(levelFile(levelId), JSON.stringify({ data, items }, null, 2));
}

function normalizeItemsLiteral(raw) {
  if (!raw) {
    return DEFAULT_ITEMS;
  }

  try {
    const parsed = JSON.parse(`[${raw}]`);
    if (
      Array.isArray(parsed) &&
      parsed.length === 2 &&
      parsed.every((part) => Array.isArray(part) && part.every((value) => Number.isFinite(value)))
    ) {
      return `${JSON.stringify(parsed[0])}, ${JSON.stringify(parsed[1])}`;
    }
  } catch {
    // Fall through to the safe default below.
  }

  return DEFAULT_ITEMS;
}

function renderIndex(levelId) {
  const indexTpl = fs.readFileSync(path.join(ROOT, "templates", "index.tpl"), "utf8");
  const helpTpl = fs.readFileSync(path.join(ROOT, "templates", "helpdlg.tpl"), "utf8");
  const stored = readStoredLevel(levelId);
  const items = normalizeItemsLiteral(stored?.items);
  const helpHtml = helpTpl.replace(/\{\$levelid\}/g, levelId);

  return indexTpl
    .replace(/\{\$items\|default:"[^"]*"\}/, items)
    .replace(/'\{\$levelid\}'/, JSON.stringify(levelId))
    .replace(/\{\$levelid\}/g, levelId)
    .replace(/\{\$xpos\}/g, "0")
    .replace(/\{\$ypos\}/g, "0")
    .replace(/\{literal\}\{\{\/literal\}/g, "{")
    .replace(/\{literal\}\}\{\/literal\}/g, "}")
    .replace(/\{include file="helpdlg.tpl"\}/g, helpHtml);
}

function buildBlocksJs() {
  const lines = ["function getBlockStrength(blockNo) {"];
  for (const [blockNo, strength] of BLOCK_STRENGTH.entries()) {
    lines.push(`if (blockNo == ${blockNo}) return ${strength};`);
  }
  lines.push("return 30;");
  lines.push("}");
  return `${lines.join("\n")}\n`;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampHeight(height) {
  if (height < 0) {
    return 0;
  }

  if (height > BRICK_HEIGHTS.length - 1) {
    return BRICK_HEIGHTS.length - 1;
  }

  return Math.round(height);
}

function buildLandscape() {
  const field = Array.from({ length: FIELD_HEIGHT }, () => Array(FIELD_WIDTH).fill(B.BLANK));
  const heights = [];

  function ensureHeightRow(y) {
    if (!heights[y]) {
      heights[y] = [];
    }
    return heights[y];
  }

  function setHeight(x, y, value) {
    ensureHeightRow(y)[x] = value;
  }

  function getHeight(x, y) {
    return heights[y]?.[x] ?? 0;
  }

  function setField(x, y, brick) {
    if (x >= 0 && x < FIELD_WIDTH && y >= 0 && y < FIELD_HEIGHT) {
      field[y][x] = brick;
    }
  }

  function getField(x, y) {
    if (x >= 0 && x < FIELD_WIDTH && y >= 0 && y < FIELD_HEIGHT) {
      return field[y][x];
    }
    return B.BLANK;
  }

  function getBrick(height) {
    return BRICK_HEIGHTS[clampHeight(height)];
  }

  function buildRange(x1, y1, x2, y2) {
    if (Math.abs(x2 - x1) <= 2 && Math.abs(y2 - y1) <= 2) {
      const a = (getHeight(x1, y2) - getHeight(x2, y2)) / (x1 - x2 || 1);
      const b = (getHeight(x1, y1) - getHeight(x2, y1)) / (y1 - y2 || 1);
      const c = getHeight(x1, y1) - a * x1 - b * y1;

      for (let y = y1; y < y2; y += 1) {
        for (let x = x1; x < x2; x += 1) {
          const height = Math.round(a * x + b * y + c);
          setHeight(x, y, height);
          setField(x, y, getBrick(height));
        }
      }
      return;
    }

    const xCenter = Math.round((x2 - x1) / 2) + x1;
    const yCenter = Math.round((y2 - y1) / 2) + y1;
    const xDiff = Math.abs(x2 - x1);

    const middleNoise = (xDiff * randInt(-1, 1) * randInt(-1, 1)) / 10;
    setHeight(
      xCenter,
      yCenter,
      (getHeight(x1, y1) + getHeight(x2, y1) + getHeight(x1, y2) + getHeight(x2, y2)) / 4 + middleNoise,
    );
    setHeight(xCenter, y1, (getHeight(x1, y1) + getHeight(x2, y1)) / 2 + (xDiff * randInt(-1, 1) * randInt(-1, 1)) / 10);
    setHeight(xCenter, y2, (getHeight(x1, y2) + getHeight(x2, y2)) / 2 + (xDiff * randInt(-1, 1) * randInt(-1, 1)) / 10);
    setHeight(x1, yCenter, (getHeight(x1, y1) + getHeight(x1, y2)) / 2 + (xDiff * randInt(-1, 1) * randInt(-1, 1)) / 10);
    setHeight(x2, yCenter, (getHeight(x2, y1) + getHeight(x2, y2)) / 2 + (xDiff * randInt(-1, 1) * randInt(-1, 1)) / 10);

    if (Math.abs(x2 - x1) <= 2) {
      buildRange(x1, y1, x2, yCenter);
      buildRange(x1, yCenter, x2, y2);
    } else if (Math.abs(y2 - y1) <= 2) {
      buildRange(x1, y1, xCenter, y2);
      buildRange(xCenter, y1, x2, y2);
    } else {
      buildRange(x1, y1, xCenter, yCenter);
      buildRange(xCenter, y1, x2, yCenter);
      buildRange(x1, yCenter, xCenter, y2);
      buildRange(xCenter, yCenter, x2, y2);
    }
  }

  function buildPlants() {
    for (let y = 0; y < FIELD_HEIGHT - 1; y += 1) {
      for (let x = 0; x < FIELD_WIDTH; x += 1) {
        if (getField(x, y) !== B.BLANK || getField(x, y + 1) === B.BLANK) {
          continue;
        }

        const height = getHeight(x, y);
        for (const plant of PLANTS) {
          if (height >= plant.minZ && height <= plant.maxZ && randInt(0, 100) > 80) {
            setField(x, y, plant.code);
          }
        }
      }
    }
  }

  function buildFrame() {
    for (let y = 0; y < FIELD_HEIGHT; y += 1) {
      setField(0, y, B.DARK_GROUND);
      setField(FIELD_WIDTH - 1, y, B.DARK_GROUND);
    }

    for (let x = 0; x < FIELD_WIDTH; x += 1) {
      setField(x, 0, B.DARK_GROUND);
      setField(x, FIELD_HEIGHT - 1, B.DARK_GROUND);
    }
  }

  setHeight(0, 0, WORLD_TOP_HEIGHT);
  setHeight(FIELD_WIDTH - 1, 0, WORLD_TOP_HEIGHT);
  setHeight(0, FIELD_HEIGHT - 1, WORLD_BOTTOM_HEIGHT);
  setHeight(FIELD_WIDTH - 1, FIELD_HEIGHT - 1, WORLD_BOTTOM_HEIGHT);

  buildRange(0, 0, FIELD_WIDTH - 1, FIELD_HEIGHT - 1);
  buildPlants();
  buildFrame();

  return `${field.map((row) => row.join("")).join("\n")}\n`;
}

function getLevelData(levelId) {
  const stored = readStoredLevel(levelId);
  if (stored?.data) {
    return stored.data;
  }

  const data = buildLandscape();
  writeStoredLevel(levelId, data, stored?.items || "");
  return data;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(querystring.parse(body)));
    req.on("error", reject);
  });
}

function serveStatic(req, res, pathname) {
  const filePath = path.resolve(ROOT, `.${pathname}`);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found");
      return;
    }

    const contentType = MIME_TYPES.get(path.extname(filePath)) || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    });
    res.end(data);
  });
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${START_PORT}`}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/" || pathname === "/index.php" || pathname === "/index.html") {
    const rawLevelId = url.searchParams.get("levelid") || url.searchParams.get("level_id");
    if (!rawLevelId) {
      redirect(res, `/index.php?levelid=${sanitizeLevelId()}`);
      return;
    }

    send(res, 200, renderIndex(sanitizeLevelId(rawLevelId)), "text/html; charset=utf-8");
    return;
  }

  if (pathname === "/js/blocks.js" || pathname === "/blocks-js.php") {
    send(res, 200, buildBlocksJs(), "text/javascript; charset=utf-8");
    return;
  }

  if (pathname === "/load.php") {
    const levelId = sanitizeLevelId(url.searchParams.get("levelid"));
    send(res, 200, getLevelData(levelId));
    return;
  }

  if (pathname === "/save.php") {
    const levelId = sanitizeLevelId(url.searchParams.get("levelid"));
    const body = await readBody(req);
    const data = typeof body.data === "string" ? body.data : getLevelData(levelId);
    const items = normalizeItemsLiteral(body.items);
    writeStoredLevel(levelId, data, items);
    send(res, 200, "Saved");
    return;
  }

  if (pathname === "/cast.php") {
    const body = await readBody(req);
    send(res, 200, CASTS.get(String(body.items || "")) || "");
    return;
  }

  serveStatic(req, res, pathname);
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error(error);
    send(res, 500, "Internal server error");
  });
});

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < START_PORT + 20) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, HOST, () => {
    console.log(`Slink Sandbox Game is running at http://${HOST}:${port}/`);
  });
}

listen(START_PORT);
