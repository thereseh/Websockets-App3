// A class to contain all the information for each note
class Note {
  constructor(hash, username, x, y, text, color) {
    this.hash = hash;
    this.username = username;
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
  }
}

module.exports = Note;
