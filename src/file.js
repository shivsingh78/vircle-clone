import fs from "fs"
import path from "path"

export async function getAllFiles(folderPath){
    let response = []

    const allFilesAndFolders = fs.readdirSync(folderPath);

    for (const file of allFilesAndFolders) {
        if ( file === ".git" ||  file === "node_modules") {
            continue;
        }

        const fullFilePath = path.join(
        folderPath,
        file
    )

    if(fs.statSync(fullFilePath).isDirectory()){
        response.push(...(await getAllFiles(fullFilePath)))
    } else{
        response.push(fullFilePath)
    }

    
    }
    return response
    
}