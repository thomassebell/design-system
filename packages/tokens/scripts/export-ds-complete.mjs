import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

function loadJSON(path) {
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf-8"));
  return {};
}

function merge(target, source) {
  var result = Object.assign({}, target);
  for (var key of Object.keys(source)) {
    var val = source[key];
    if (val && typeof val === "object" && !Array.isArray(val) && !("value" in val)) {
      result[key] = merge(result[key] || {}, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

function mapType(type) {
  var map = {
    color: "color",
    spacing: "dimension",
    borderRadius: "dimension",
    fontSize: "dimension",
    fontFamily: "string",
    fontWeight: "number",
    lineHeight: "number",
    letterSpacing: "dimension",
    duration: "string",
    cubicBezier: "string",
    boxShadow: "shadow",
    number: "number",
    string: "string",
  };
  return map[type] || type || "string";
}

function stripFontFallbacks(value) {
  if (typeof value !== "string") return value;
  var first = value.split(",")[0].trim().replace(/^'|'$/g, "");
  return first;
}

function toDTCG(obj, path) {
  if (!path) path = [];
  var result = {};
  for (var key of Object.keys(obj)) {
    var val = obj[key];
    if (val && typeof val === "object" && "value" in val) {
      var currentPath = path.concat([key]);
      var pathStr = currentPath.join(".");
      var token = {
        "$value": val.value,
        "$type": mapType(val.type),
      };

      // Strip font fallbacks for Figma (Figma only uses one font)
      if (val.type === "fontFamily") {
        token["$value"] = stripFontFallbacks(val.value);
      }

      if (val.comment) token["$description"] = val.comment;
      result[key] = token;
    } else if (val && typeof val === "object") {
      result[key] = toDTCG(val, path.concat([key]));
    }
  }
  return result;
}

// Load all token files
var all = {};
all = merge(all, loadJSON("brands/brand-a-colors.json"));
all = merge(all, loadJSON("brands/brand-a-overrides.json"));
all = merge(all, loadJSON("src/color-semantic.json"));
all = merge(all, loadJSON("src/typography-shared.json"));
all = merge(all, loadJSON("src/spacing-shared.json"));

var dtcg = toDTCG(all);

mkdirSync("figma", { recursive: true });
writeFileSync("figma/ds-complete.json", JSON.stringify(dtcg, null, 2));
console.log("✓ figma/ds-complete.json generated");
console.log("  → Import into your DS Figma file");
console.log("  → Primitives and semantics are included so aliases will resolve");
