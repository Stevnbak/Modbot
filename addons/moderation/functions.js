module.exports = {
    getLength,
    lengthToString,
};

function getLength(string) {
    var timeChars = {s: 1, m: 60, h: 60 * 60, d: 24 * 60 * 60, w: 7 * 24 * 60 * 60, y: 365 * 24 * 60 * 60};
    for (i in Object.keys(timeChars)) {
        let char = Object.keys(timeChars)[i];
        if (string.includes(char)) {
            if (!isNaN(string.replace(char, ''))) {
                return string.replace(char, '') * timeChars[char];
            }
        }
    }
    return -1;
}
function lengthToString(length) {
    let days = Math.floor(length / (24 * 60 * 60));
    let hours = Math.floor((length - days * 24 * 60 * 60) / (60 * 60));
    let minutes = Math.floor((length - hours * 60 * 60 - days * 24 * 60 * 60) / 60);
    let seconds = length - minutes * 60 - hours * 60 * 60 - days * 24 * 60 * 60;
    var string = '';
    if (days != 0) string += days + ' day';
    if (days != 1 && days != 0) string += 's ';
    else if (days != 0) string += ' ';
    if (hours != 0) string += hours + ' hour';
    if (hours != 1 && hours != 0) string += 's ';
    else if (hours != 0) string += ' ';
    if (minutes != 0) string += minutes + ' minute';
    if (minutes != 1 && minutes != 0) string += 's ';
    else if (minutes != 0) string += ' ';
    if (seconds != 0) string += seconds + ' second';
    if (seconds != 1 && seconds != 0) string += 's ';
    else if (seconds != 0) string += ' ';
    return string;
}
