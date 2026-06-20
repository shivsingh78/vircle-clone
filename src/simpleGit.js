import simpleGit from "simple-git";

const git =simpleGit()

async function  status(){
    console.log(await git.status());
    
}
async function push() {
    console.log(await git.add("."))
    console.log(await git.commit("implement genrate function to create random id"));
    
    console.log((await git.branch()).current);
    
}
push()


