/**
 * move(+Move, +Board, -NewBoard)
 * 
 * Applies move to the board resulting in a new board.
 */
move(Move, Board, NewBoard):-
    append_lists(_,[Row,Column, Piece|_], Move),
    move_piece(Row, Column, Piece, Board, NewBoard).

/**
 * move_piece(+Row, +Column, +Piece, +CurrentBoard, -NewBoard)
 * 
 * Validates move and creates a new board with that move.
 */
move_piece(Row, Column, Piece, CurrentBoard, NewBoard):-
    once(check_free_space(Row, Column, CurrentBoard)),
    once(check_pieces_number(Piece, CurrentBoard)),
    is_move_valid(Row, Column, Piece, CurrentBoard),
    move_to_line(Row, Column, Piece, CurrentBoard, NewBoard).

move_to_line(1, Column, Piece, [Row | Rest], [New_row | Rest]):-
    move_to_column(Column, Piece, Row, New_row).

move_to_line(N, Column, Piece, [Row | Rest], [Row | New_rest]):-
    N > 1,
    Next is N - 1,
    move_to_line(Next, Column, Piece , Rest, New_rest).

move_to_column(1, Piece, [_ | Rest], [Piece | Rest]).

move_to_column(N, Piece, [X | Rest], [X | New_rest]):-
    N > 1,
    Next is N - 1,
    move_to_column(Next, Piece , Rest, New_rest).

/**
 * switch_player(+Player1, -Player2)
 * 
 * Succeeds if Player1 succeeds Player2.
 */
switch_player(1, 2).
switch_player(2, 1).

/**
 * next_player(+Player, -NewPlayer)
 * 
 * Returns which player is next considering current player.
 */
next_player(Player, NewPlayer):-
    switch_player(Player, NewPlayer).

/**
 * game_over(+Board, +Player)
 * 
 * Checks if the game has ended and displays the final board and message.
 */
game_over(Board, Player):-
    check_game_over(Board),
    display_game_over(Board, Player).

/**
 * check_game_over(+Board)
 *
 * Checks if the game is over;
 * The game is over if a row, column or quadrant has the 4 distinct solids.
 */
check_game_over(Board):-
    check_full_row(4, 4, Board)
    ;
    check_full_column(4, Board)
    ;
    check_full_quadrant(Board).

/**
 * check_full_row(+Row, +Column, +Board)
 *
 * Checks if a row has the 4 distinct solids.
 */
check_full_row(Row, Column, Board):-
    check_full_row_in_line(Row, Column, Board).

/**
 * check_full_row_in_line(+Row, +Column, +Board)
 *
 * Succeeds if there is one row with the 4 distinct solids.
 */
check_full_row_in_line(0, _, []):- !, fail.
check_full_row_in_line(N, Column, [Row | Rest]):-
    once(check_full_row_in_column(Column, Row))
    ;
    N > 1,
    Next is N - 1,
    check_full_row_in_line(Next, Column, Rest).

/**
 * check_full_row_in_column(+Column, +Board)
 *
 * Succeeds if the cell has a different solid from the rest of the row.
 */
check_full_row_in_column(0, []):- !.
check_full_row_in_column(N, [X | Rest]):-
    once(check_repeated_solids(X, Rest)),
    N > 0,
    Next is N - 1,
    check_full_row_in_column(Next, Rest).

/**
 * check_full_column(+Row, +Board)
 *
 * Checks if a column has the 4 distinct solids.
 */
check_full_column(Row, Board):-
    check_full_column_in_line(Row, 1, Board, _);
    check_full_column_in_line(Row, 2, Board, _);
    check_full_column_in_line(Row, 3, Board, _);
    check_full_column_in_line(Row, 4, Board, _).

check_full_column_in_line(0, _, [], _):- !.
check_full_column_in_line(N, Column, [Row | Rest], SolidList):-
    once(check_full_column_in_column(Column, Row, SolidList, B)),
    once(append_lists(SolidList, B, NewSolidList)),
    N > 0,
    Next is N - 1,
    check_full_column_in_line(Next, Column, Rest, NewSolidList).

check_full_column_in_column(1, [X | _], SolidList, [X | _]):-
    check_repeated_solids(X, SolidList), !. 
check_full_column_in_column(N, [_ | Rest], SolidList, NewSolidList):-
    once(N > 1),
    once(Next is N - 1),
    check_full_column_in_column(Next, Rest, SolidList, NewSolidList).
    
/**
 * check_full_quadrant(+Board)
 *
 * Checks if a quadrant has the 4 distinct solids.
 */
check_full_quadrant(Board):-
    check_full_quadrant_X(1, 1, Board);
    check_full_quadrant_X(3, 1, Board);
    check_full_quadrant_X(1, 3, Board);
    check_full_quadrant_X(3, 3, Board).

/**
 * check_full_quadrant_X(+Row, +Column, +Board)
 *
 * Checks if the quadrant has the 4 distinct solids.
 */
check_full_quadrant_X(Row, Column, Board):-
    (
    diagonal(Row, Column, DRow, DColumn)
    ;
    diagonal(DRow, DColumn, Row, Column)
    ),
    once(check_full_quadrant_in_line(Row, Column, Board, _, NewSolidList)),
    once(check_full_quadrant_in_line(DRow, DColumn, Board, NewSolidList, NewSolidList2)),
    once(check_full_quadrant_in_line(Row, DColumn, Board, NewSolidList2, NewSolidList3)),
    check_full_quadrant_in_line(DRow, Column, Board, NewSolidList3, _).

check_full_quadrant_in_line(1, Column, [Row | _], SolidList, NewSolidList):-  
    once(check_full_quadrant_in_column(Column, Row, SolidList, B)),
    append_lists(SolidList, B, NewSolidList), !.

check_full_quadrant_in_line(N, Column, [_ | Rest], SolidList, NewSolidList):-
    N > 1,
    Next is N - 1,
    check_full_quadrant_in_line(Next, Column, Rest, SolidList, NewSolidList).

check_full_quadrant_in_column(1, [X | _], SolidList, [X | _]):-
    check_repeated_solids(X, SolidList), !. 
    
check_full_quadrant_in_column(N, [_ | Rest], SolidList, NewSolidList):-
    once(N > 1),
    once(Next is N - 1),
    check_full_quadrant_in_column(Next, Rest, SolidList, NewSolidList).
    
/**
 * check_repeated_solids(+Piece, +SolidList)
 * 
 * Succeeds if solid list is empty or if the piece has a different shape 
 * from the ones in the solid list.
 */
check_repeated_solids(Piece, SolidList):-
    list_empty(SolidList)
    ;
    solid_isnt_in_list(Piece, SolidList).

/**
 * solid_isnt_in_list(+Piece, +SolidList)
 * 
 * Succeeds if the piece has a different shape from the ones in the solid list.
 */
solid_isnt_in_list(empty, [_ | _]):- !, fail.     % Empty piece
solid_isnt_in_list(_, []):- !.                    % All different solids
solid_isnt_in_list(_, [empty | _]):- !, fail.     % Empty cell
solid_isnt_in_list(Piece, [X | Y]):-
    % Found the same solid
    symb_solid(Piece, PieceSolid),
    symb_solid(X, XSolid),
    XSolid == PieceSolid,
    !, fail
    ;
    solid_isnt_in_list(Piece, Y).



human_move(Board,Player,NewBoard):-
    % Ask and validate move
    validate_move_input(Row, Column, Piece, Player),

    % Move Piece 
    (move([Row, Column, Piece], Board, NewBoard)
    ;
    display_move_error,
    fail).


/**
 * game_loop(+Player, +Board, +PlayerType, +NextPlayerType, +Level) 
 * 
 * Main game loop for a computer or human player turn;
 * If the player wins the game ends;
 * If next player does not have more valid moves, the game ends as a tie;
 * If nothing of that happens, it's next player turn.
 */
game_loop(Player, Board, h, NextPlayerType, Level):-
    repeat,

    % Move Human Piece
    once(human_move(Board,Player,NewBoard)),

    % Check Game Over
    (game_over(NewBoard, Player)
    ;
    next_player(Player, NewPlayer),
        % Checks for next turn valid moves
        (valid_moves(NewBoard, NewPlayer, AllBoards),

        % No more valid moves
        list_empty(AllBoards),
        display_tie(NewBoard)   
        ;
        
        % Next player turn
        display_game(NewBoard, NewPlayer),
        game_loop(NewPlayer, NewBoard,  NextPlayerType, h, Level)
        )
    ).

game_loop(Player, Board, c, NextPlayerType, Level):-
    repeat,

    % Move Computer Piece 
    once(computer_move(Board, Player, Level, FinalBoard)),
   
    % Check Game Over
    (game_over(FinalBoard, Player)
    ;
    next_player(Player, NewPlayer),

        % Checks for next turn valid moves
        (valid_moves(FinalBoard, NewPlayer, AllBoards),

        % No more valid moves
        (list_empty(AllBoards)),
        display_tie(FinalBoard)      
        ;

        % Next player turn
        display_game(FinalBoard, NewPlayer),
        sleep(0.5),
        game_loop(NewPlayer, FinalBoard,  NextPlayerType, c, Level)
        )
    ).


