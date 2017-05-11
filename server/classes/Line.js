// A class to contain all the information for each note
class Line {
  constructor(hash, username, toX, toY, fromX, fromY, room, toHash, fromHash) {
    this.objectType = "line";
    this.hash = hash;
    this.username = username;
    this.noteParentFrom = fromHash;
    this.noteParentTo = toHash;
    this.room = room;
    this.toX = toX; 
    this.toY = toY; 
    this.fromX = fromX; 
    this.fromY = fromY; 
    this.room = room;
  }
}

module.exports = Line;
