/**
 * Converts a 2 dimension array into json array
 * @param {Array} param 
 * @returns {Array.<JSON>}
 */
const arrayToJson = ([keys, ...values]) => values.map(vs => Object.fromEntries(vs.map((v, i) => [keys[i], v])));

/**
 * Calculates time left to midnight from now in milliseconds
 * @returns {Number} number
 */
function msToMidnight() {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day
        0, 0, 0 // ... at 00:00:00 hours
    );

    return night.getTime() - now.getTime();
}

/**
 * Returns the number of milliseconds to 9:00 AM tomorrow
 * @returns {Number} 
 */
function msToNextTime(){
    var now = new Date();
    var nextTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Next Day
        9, 0, 0 // 9 AM
    );

    return nextTime.getTime() - now.getTime();
}

module.exports = {
    arrayToJson,
    msToMidnight,
    msToNextTime
}