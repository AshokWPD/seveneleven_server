const fs = require("fs");
const swaggerDocument = require("../api_doc.json");
// const swaggerDocument = require("../swagger-output.json");

function updateSwaggerDescriptionWithTagCounts() {
  const tagCountMap = {};
  const paths = swaggerDocument.paths;

  for (const path in paths) {
    for (const method in paths[path]) {
      const endpoint = paths[path][method];
      const tags = endpoint.tags || ["Untagged"];

      tags.forEach((tag) => {
        tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
      });
    }
  }

  // Create Markdown table
  let description =
    "### API Summary\n| Category | Count |\n|----------|-------|\n";
  let total = 0;

  for (const [tag, count] of Object.entries(tagCountMap)) {
    description += `| ${tag} | ${count} |\n`;
    total += count;
  }

  description += `\n**Total APIs: ${total}**`;

  // Inject description into swagger.info
  swaggerDocument.info.description = description;

  // Optionally save to file (if regenerating swagger.json)
  fs.writeFileSync("../api_doc.json", JSON.stringify(swaggerDocument, null, 2));
}

module.exports = updateSwaggerDescriptionWithTagCounts;
