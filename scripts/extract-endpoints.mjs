import fs from 'fs';
import path from 'path';

const hierarchyPath = '/Users/namanganapathi/CapDoc/reference/api_hierarchy.md';
const content = fs.readFileSync(hierarchyPath, 'utf-8');

const lines = content.split('\n');
const endpoints = [];
let currentCategory = '';
let currentSubcategory = '';

lines.forEach(line => {
  const matchH2 = line.match(/^##\s+(.+)$/);
  if (matchH2) {
    currentCategory = matchH2[1].trim();
    currentSubcategory = '';
    return;
  }

  const matchSubcategory = line.match(/^\s*-\s+\*\*(.+)\*\*$/);
  if (matchSubcategory) {
    currentSubcategory = matchSubcategory[1].trim();
    return;
  }

  const matchEndpoint = line.match(/^\s*-\s+([^*-].+)$/);
  if (matchEndpoint && currentCategory) {
    const title = matchEndpoint[1].trim();
    // Ignore some non-API entries
    if (title.toLowerCase() === 'overview' || title.toLowerCase() === 'introduction') return;
    
    endpoints.push({
      category: currentCategory,
      subcategory: currentSubcategory || null,
      title: title,
      status: "pending",
      specFile: null
    });
  }
});

const outputPath = path.join(process.cwd(), 'endpoints-registry.json');
fs.writeFileSync(outputPath, JSON.stringify(endpoints, null, 2));

console.log(`Extracted ${endpoints.length} endpoints to endpoints-registry.json`);
