let max_length=8
 export function genrate(){
    let ans=""
    const subset="9FdNP6jJ68XdrseBovuAWsI3nVuhBT9N7yEOlXxycQTN9IkKp31jOGW6ZqU30xlbepG7zqhcePLyPONW1JY66o89SK5RTwo1ajgR"
    for(let i=0;i<max_length;i++){
        ans+=subset[Math.floor(Math.random()*subset.length)]
    }
    return ans
}