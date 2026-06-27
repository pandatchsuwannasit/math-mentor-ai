/**
 * Migration script: Convert question-bank from per-level files to per-topic files
 */

const fs = require("fs")
const path = require("path")

const QUESTION_BANK_DIR = path.join(__dirname, "..", "lib", "question-bank")
const levels = ["m1", "m2", "m3", "m4", "m5", "m6"]

const topicFileMap = {
  "m1-integers": "integers",
  "m1-exponents": "exponents",
  "m1-linear-equations": "linear-equations",
  "m1-basic-geometry": "basic-geometry",
  "m1-data-basics": "data-basics",
  "m2-polynomials": "polynomials",
  "m2-factoring": "factoring",
  "m2-pythagorean": "pythagorean",
  "m2-probability": "probability",
  "m3-quadratics": "quadratics",
  "m3-functions": "functions",
  "m3-trigonometry": "trigonometry",
  "m3-triangle-trig": "triangle-trig",
  "m3-geometry-apps": "geometry-apps",
  "m4-advanced-algebra": "advanced-algebra",
  "m4-sequences": "sequences",
  "m4-coordinate-geometry": "coordinate-geometry",
  "m4-circles": "circles",
  "m4-statistics-advanced": "statistics-advanced",
  "m5-trigonometry-advanced": "trigonometry-advanced",
  "m5-calculus-basics": "calculus-basics",
  "m5-derivatives": "derivatives",
  "m5-probability-advanced": "probability-advanced",
  "m6-limits": "limits",
  "m6-derivatives-advanced": "derivatives-advanced",
  "m6-integrals": "integrals",
  "m6-applications": "applications",
  "m6-advanced-probability": "advanced-probability",
}

// Create directories
levels.forEach((level) => {
  const dir = path.join(QUESTION_BANK_DIR, level)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Helper: extract content between matching braces
function extractBraces(content, startIndex) {
  let depth = 0
  let i = startIndex
  while (i < content.length) {
    if (content[i] === "{") depth++
    else if (content[i] === "}") depth--
    if (depth === 0) return content.slice(startIndex, i + 1)
    i++
  }
  return null
}

// Parse each level file
levels.forEach((level) => {
  const filePath = path.join(QUESTION_BANK_DIR, `${level}.ts`)
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath}`)
    return
  }

  const content = fs.readFileSync(filePath, "utf-8")
  
  // Find the object start
  const objStart = content.indexOf("= {")
  if (objStart === -1) {
    console.log(`Could not find object in ${filePath}`)
    return
  }

  const objContent = content.slice(objStart + 2).trim()
  
  // Find all topic arrays using brace counting
  let i = 0
  while (i < objContent.length) {
    // Find next topic key
    const keyMatch = objContent.slice(i).match(/^"([^"]+)":\s*\[/s)
    if (!keyMatch) break
    
    const topicId = keyMatch[1]
    const arrayStart = i + keyMatch[0].indexOf("[")
    
    // Find matching closing bracket
    let depth = 0
    let j = arrayStart
    while (j < objContent.length) {
      if (objContent[j] === "[") depth++
      else if (objContent[j] === "]") depth--
      if (depth === 0) {
        const questionsStr = objContent.slice(arrayStart, j + 1)
        
        // Extract individual questions
        const questions = []
        let qStart = questionsStr.indexOf("{")
        while (qStart !== -1) {
          const qEnd = questionsStr.indexOf("}", qStart)
          if (qEnd === -1) break
          questions.push(questionsStr.slice(qStart, qEnd + 1).trim())
          qStart = questionsStr.indexOf("{", qEnd + 1)
        }
        
        if (questions.length > 0) {
          const filename = topicFileMap[topicId]
          if (!filename) {
            console.log(`No mapping for ${topicId}`)
          } else {
            const constName = `${level.toUpperCase()}_${filename.replace(/-/g, "_").toUpperCase()}_QUESTIONS`
            const outputPath = path.join(QUESTION_BANK_DIR, level, `${filename}.ts`)
            
            const fileContent = `import type { QuizQuestion } from "../types"

export const ${constName}: QuizQuestion[] = [
${questions.map((q, idx) => `  ${q}${idx < questions.length - 1 ? "," : ""}`).join("\n")}
]
`
            
            fs.writeFileSync(outputPath, fileContent)
            console.log(`Created: ${level}/${filename}.ts (${questions.length} questions)`)
          }
        }
        
        i = j + 1
        break
      }
      j++
    }
    
    // Move past the comma after the array
    const commaIdx = objContent.indexOf(",", j)
    if (commaIdx === -1) break
    i = commaIdx + 1
  }
})

// Create index files for each level
levels.forEach((level) => {
  const dir = path.join(QUESTION_BANK_DIR, level)
  if (!fs.existsSync(dir)) return
  
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts")
  
  const exports = files
    .map((f) => {
      const name = f.replace(".ts", "")
      const constName = `${level.toUpperCase()}_${name.replace(/-/g, "_").toUpperCase()}_QUESTIONS`
      return `export { ${constName} } from "./${name}"`
    })
    .join("\n")
  
  fs.writeFileSync(path.join(dir, "index.ts"), exports + "\n")
  console.log(`Created: ${level}/index.ts (${files.length} files)`)
})

console.log("\nMigration complete!")