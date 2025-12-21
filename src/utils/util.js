export function isChristmas(){
    const date = new Date()
    const isChristmasTime = date.getMonth() == 11 && date.getDate() > 15
    return isChristmasTime
}