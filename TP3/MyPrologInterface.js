/**
 * MyPrologInterface
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPrologInterface {
    constructor(gameOrch) {
        this.hasReply = false;
        this.gameOrch = gameOrch;
        this.board = this.gameOrch.gameboard;
        this.gameSequence = this.gameOrch.gameSequence;
        this.approval = false;
        this.gameOver = false;
    }

    convertBoardToString() {
        let newBoard = "[";
        for (let i = 0; i < 4; i++) {
            newBoard += "[";
            for (let j = 0; j < 4; j++) {
                if (this.board.tiles[i][j].piece == null) {
                    newBoard += "empty";
                }
                else {
                    ////console.log(this.board.tiles[i][j].piece);
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
        ////console.log(newBoard);
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
        ////console.log(firstTry);
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
                //console.log("i: " + i + " = " + newBoard[i]);
                temp = newBoard.substring(i, newBoard.length);
                ////console.log(temp);
                let temp2 = temp.match(/[^\[\,][^\, \[ \]]{1,6}[^\]\,]/)[0];
                //console.log(temp2);
                piece = temp2.substring(0, temp2.length);
                //console.log(piece);
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
        let good = response.match("good") != null ? response.match("good")[0] : null;
        if (good != null) {
            this.approval = true;
            //this.board = response.match(/\[{2}.*\]{2}/)[0];
            this.gameOver =  response.match("won") != null || response.match("tie") != null ? true : false;
            console.log(this.gameOver);
            console.log("1: player " + this.player)

            if (response.match("won") != null) {
                console.log("2: player " + this.player)
                let currentScore = this.gameOrch.score;
                if (this.player == 1) {
                    console.log("3: player " + this.player)
                    this.gameOrch.score["white"] += 1;

                }
                else {
                    console.log("4: player " + this.player)
                    this.gameOrch.score["black"] += 1;
                }
                this.gameOrch.updateScoreBoard();
                document.getElementById("player").innerText = "Player " + this.player + " Wins!";
            }
        } else {
            this.approval = false;
        }
    }

    //Handle the Reply
    handleBotMoveReply(data) {
        let response = data.target.response;
        //console.log(response)
        let tmp = response.match(/\[{2}.*\]{2}/)[0];
        this.getBotMove(tmp.substring(1, tmp.length));
        this.gameOver = response.match("won") != null || response.match("tie") != null ? true : false;

        if (response.match("won") != null) {
            let player = this.botPlayer == 1 ? "white" : "black";
            this.gameOrch.score[player] += 1;
            console.log(this.gameOrch.score);
            this.gameOrch.updateScoreBoard();
            document.getElementById("player").innerText = "Player " + this.player + " Wins!";
        }
        else if(response.match("tie") != null){
            document.getElementById("player").innerText = "It's a Tie!";
        }

    }

    //
    handleStart(data) {
        let response = data.target.response;
        if (this.player == null) {
            if (response.match("]],1]") != null) {
                this.player = 1;
                this.botPlayer = 2;
            }
            else if (response.match("]],2]") != null) {
                this.player = 2;
                this.botPlayer = 1;
            }
            this.gameOrch.updateScoreBoard();
            document.getElementById("player").innerText = "Player " + this.player + "'s turn";
        }
    }



    makeRequest(requestString, handleReply) {
        this.getPrologRequest(requestString, handleReply);
    }

    requestStart() {
        this.gameOver = false;
        this.makeRequest("play", this.handleStart.bind(this))
    }
    requestMove(player, piece, destination) {
        let move = "move(" + destination[0] + "," + destination[1] + "," + this.pieceName(piece) + "," + player + "," + this.convertBoardToString() + ")";
        this.player = player;
        console.log("Prolog player is "+ this.player);
        this.makeRequest(move, this.handleMoveReply.bind(this));
        return this.approval;
    }

    async requestBotMove(level, player) {
        this.botPlayer = player;
        let move = "bot_move(" + this.convertBoardToString() + "," + level + "," + player + ")";
        this.makeRequest(move, this.handleBotMoveReply.bind(this));
    }


}