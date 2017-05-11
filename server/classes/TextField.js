// A class to contain all the information for each note
class TextField {
  constructor(hash, username, x, y, text, textColor, room) {
    this.objectType = 'textField';
    this.hash = hash;
    this.username = username;
    this.x = x; // NOTE: This is center x
    this.y = y; // NOTE: This is center y
    this.radiusx = 50;
    this.radiusy = 50;
    this.width = 100;
    this.height = 100;
    this.text = text;
    this.textColor = textColor;
    this.focus = false;
    this.room = room;
  }
}

module.exports = TextField;
