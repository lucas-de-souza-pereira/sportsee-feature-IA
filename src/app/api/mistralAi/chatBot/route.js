import fs from "fs/promises"
import path from "path"

const HISTORY_PATH = path.join(process.cwd(),"src/app/data","chatHistory.json")

async function createHistoryFile() {
    try {
        await fs.readFile(HISTORY_PATH, "utf-8")
    } catch (err){
        if (err.code ===  "ENOENT"){
            await fs.mkdir(path.dirname(HISTORY_PATH), {recursive: true})
            await fs.writeFile(HISTORY_PATH, {}, "utf-8")
        }
    else {
        throw err
        }
    }
}

