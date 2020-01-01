/**
 * MyPrologInterface
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPrologInterface {
    constructor(gameBoard, gameSequence) {
        this.hasReply = false;
        this.board = gameBoard;
        this.gameSequence = gameSequence;
        console.log(this.board.tiles);
        this.approval = false;
    }

    convertBoardToString() {
        console.log(this.board.tiles);
        let newBoard = "[";
        for (let i = 0; i < 4; i++) {
            newBoard += "[";
            for (let j = 0; j < 4; j++) {
                if (this.board.tiles[i][j].piece == null) {
                    newBoard += "empty";
                }
                else {
                    console.log(this.board.tiles[i][j].piece);
                    newBoard += this.pieceNameOutput(this.board.tiles[i][j].piece);
                }
                if (j != 3) {
                    newBoard += ",";
                }
            }
            newBoard += "]";

            if (i != 3) {
                newBoard += ",";
            }
        }
        newBoard += "]";
        console.log(newBoard);
        return newBoard;
    }

    pieceName(piece) {
        let prefix = piece.player == 1 ? "w" : "b";
        let sufix = "";
        switch (piece.id.substring(0, piece.id.length - 1)) {
            case "cylinder":
                sufix = "Cyl";
                break;
            case "cube":
                sufix = "Cub";
                break;
            case "sphere":
                sufix = "Sph";
                break;
            case "cone":
                sufix = "Con";
                break;
        }
        return (prefix + sufix);
    }

    reversePieceName(name) {
        let player = this.botPlayer;
        let piece = "";
        switch (name.substring(0, name.length - 1)) {
            case "cil_":
                piece = "cylinder";
                break;
            case "cube_":
                piece = "cube";
                break;
            case "sph_":
                piece = "sphere";
                break;
            case "cone_":
                piece = "cone";
                break;
        }
        let firstTry = piece + "1" + "p" + player;
        console.log(firstTry);
        if (this.board.getPiece(firstTry).tile == null) {
            piece = firstTry;
        } else {
            piece += "2" + "p" + player;
        }

        return (piece);
    }

    pieceNameOutput(piece) {
        let sufix = piece.player == 1 ? "w" : "b";
        let prefix = "";
        switch (piece.id.substring(0, piece.id.length - 1)) {
            case "cylinder":
                prefix = "cil_";
                break;
            case "cube":
                prefix = "cube_";
                break;
            case "sphere":
                prefix = "sph_";
                break;
            case "cone":
                prefix = "cone_";
                break;
        }
        return (prefix + sufix);
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();


        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }



    getBotMove(newBoard) {
        let temp = "";
        let current = this.convertBoardToString();
        let counter = 0;
        let i = 0;
        let piece;
        for (; i < current.length && i < newBoard.length; i++) {
            if (current[i] != newBoard[i]) {
                console.log("i: " + i + " = " + newBoard[i]);
                temp = newBoard.substring(i, newBoard.length);
                console.log(temp);
                let temp2 = temp.match(/[^\[\,][^\, \[ \]]{1,6}[^\]\,]/)[0];
                console.log(temp2);
                piece = temp2.substring(0, temp2.length);
                console.log(piece);
                break;
            }
            if (newBoard[i] == ",") {
                counter++;
            }
        }
        let newPos = this.board.getTileWithCoordinates(counter + 1);
        let newPiece = this.reversePieceName(piece);
        let move = new MyGameMove(this.board.scene, this.board.getPiece(newPiece), this.board.getTile(counter + 1), this.board);
        move.animateMove();
        this.gameSequence.addGameMove(move);
    }

    //Handle the Reply
    handleMoveReply(data) {
        let response = data.target.response;
        console.log("Resp: " + response)
        let good = response.match("good") != null ? response.match("good")[0] : null;
        if (good != null) {
            this.approval = true;
            //this.board = response.match(/\[{2}.*\]{2}/)[0];
        } else {
            this.approval = false;
        }
    }

    //Handle the Reply
    handleBotMoveReply(data) {
        let response = data.target.response;
        console.log(response)
        let tmp = response.match(/\[{2}.*\]{2}/)[0];
        this.getBotMove(tmp.substring(1, tmp.length));
    }

    makeRequest(requestString, handleReply) {
        this.getPrologRequest(requestString, handleReply);
    }

    requestMove(piece, destination) {
        let move = "move(" + destination[0] + "," + destination[1] + "," + this.pieceName(piece) + "," + piece.player + "," + this.convertBoardToString() + ")";
        this.makeRequest(move, this.handleMoveReply.bind(this));
        console.log(move);
        return this.approval;
    }

    requestBotMove(level, player) {
        this.botPlayer = player;
        let move = "bot_move(" + this.convertBoardToString() + "," + level + "," + player + ")";
        this.makeRequest(move, this.handleBotMoveReply.bind(this));
    }
}