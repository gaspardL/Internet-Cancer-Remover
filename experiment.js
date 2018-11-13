
emoji = [0x1F600];
console.log(emoji);
document.getElementById('test').innerHTML = String.fromCodePoint(emoji);
console.log(String.fromCodePoint(emoji));

document.body.innerHTML = document.body.innerHTML.replace(String.fromCodePoint(emoji), ':)');