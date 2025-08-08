import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Allow ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entitiesDir = path.resolve(__dirname, "../src/entities");
const files = fs.readdirSync(entitiesDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const name = path.basename(file, ".json");
  const jsFile = `${entitiesDir}/${name}.js`;

  const content = `import { createEntityClient } from "../utils/entityWrapper";
import schema from "./${name}.json";
export const ${name} = createEntityClient("${name}", schema);
`;

  fs.writeFileSync(jsFile, content);
}
