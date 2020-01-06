/**
 * generator_move(-Row, -Column, -Piece, +Player)
 * 
 * Generates a move for the player given.
 */
generator_move(Row, Column, Piece, Player):-
    member(Row, [1, 2, 3, 4]),
    member(Column, [1, 2, 3, 4]),
    symb_of_player(Piece, Player).

/**
 * random_move(+Board, +Player, -NewBoard)
 * 
 * Generates a valid move and the resulting board.
 */
random_move(Board, Player, NewBoard):-
    generator_move(Row, Column, Piece, Player),
    is_move_valid(Row, Column, Piece, Board),
    move([Row, Column, Piece], Board, NewBoard).

/**
 * valid_moves(+Board, +Player, -AllBoards)
 * 
 * Generates all possible boards for Player turn.
 */
valid_moves(Board, Player, AllBoards):-
    findall(NewBoard, random_move(Board, Player, NewBoard), AllBoards).

/**
 * computer_move(+Board, +Player, +Level, -FinalBoard)
 * 
 * Chooses one of the possible Player moves.
 */
computer_move(Board, Player, Level, FinalBoard):-
    valid_moves(Board, Player, PossibleBoards),
    choose_move(PossibleBoards, Level, FinalBoard).

/**
 * choose_move(+PossibleBoards, +Level, -FinalBoard)
 * 
 * Evaluates all boards and chooses one of them.
 */
choose_move(PossibleBoards, Level, FinalBoard):-
    evaluate_moves(PossibleBoards, WinningBoards),
    choose_one_board(Level, PossibleBoards, WinningBoards, FinalBoard).

/**
 * evaluate_moves(+AllBoards, -WinningBoards)
 * 
 * Evaluates all boards.
 */
evaluate_moves(AllBoards, WinningBoards) :-
    evaluate(AllBoards, _, WinningBoards).

/**
 * evaluate(+AllBoards, +WinningBoards, -NewWinningBoards)
 * 
 * Evaluates a board and adds it to the winning boards list if it's one of them.
 */
evaluate([], WinningBoards, WinningBoards):- !.
evaluate([Board | Rest], WinningBoards, NewWinningBoards):-
    once(value(Board, Value)),
    once(add_board_by_value(Board, Value, WinningBoards, NewWinningBoards2)),
    evaluate(Rest, NewWinningBoards2, NewWinningBoards).

/**
 * value(+Board, -Value)
 * 
 * Gives a value to the board considering if it's a winning board or not.
 */
value(Board, Value):-
    check_game_over(Board),
    good_move(Value)
    ;
    bad_move(Value).

/** 
 * good_move(+Value)
 * 
 * Succeeds if it's a winning move.
 */
good_move(1).

/**
 * bad_move(+Value)
 * 
 * Succeeds if it's not a winning move. 
 */
bad_move(0).

/**
 * add_board_by_value(+Board, +Value, +WinningBoards, -NewWinningBoards)
 * 
 * Adds board to winning boards list according to board's value.
 */
add_board_by_value(_, 0, WinningBoards, NewWinningBoards):- 
    append_lists(WinningBoards, [], NewWinningBoards).

add_board_by_value(Board, 1, WinningBoards, NewWinningBoards):- 
    append_lists(WinningBoards, [Board], NewWinningBoards).

/**
 * choose_one_board(+Level, +PossibleBoards, +WinningBoards, -FinalBoard)
 * 
 * Chooses one of the possible boards according to the difficulty level.
 */
choose_one_board(1, PossibleBoards, _, FinalBoard):-
    choose_random_move(PossibleBoards, FinalBoard).

choose_one_board(2, PossibleBoards, WinningBoards, FinalBoard):-
    list_empty(WinningBoards),
    choose_random_move(PossibleBoards, FinalBoard)
    ;
    choose_random_move(WinningBoards, FinalBoard).

/**
 * choose_random_move(+AllBoards, -FinalBoard)
 * 
 * Chooses randomly one of the boards received.
 */
choose_random_move(AllBoards, FinalBoard) :- 
    random_select(FinalBoard, AllBoards, _).
    