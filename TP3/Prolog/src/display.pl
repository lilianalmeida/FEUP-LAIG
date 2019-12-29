/** Initial Board **/
initial_board([
    [empty, empty, empty, empty],
    [empty, empty, empty, empty],
    [empty, empty, empty, empty],
    [empty, empty, empty, empty]
]).

/** Example of Intermediate Board **/
mid_board([
    [empty, cube_w, empty,  cil_b],
    [cil_w, sph_b,  empty,  empty],
    [empty, cone_b, cone_b, sph_w],
    [empty, empty,  cil_w,  empty]
]).

/** Example of Final Board **/
final_board([
    [empty, cube_w, empty,  cil_b],
    [cil_w, sph_b,  empty,  empty],
    [empty, cone_b, cone_b, sph_w],
    [empty, empty,  cil_w,  cube_w]
]).

/**
 * cell_symbol(+Cell, -CellDisplay)
 * cell_symbol(-Cell, +CellDisplay)
 * 
 * Succeeds if the cell has a display form.
 */
cell_symbol(empty,'    ').
cell_symbol(cube_w, wCub).
cell_symbol(cil_w, wCyl).
cell_symbol(cone_w, wCon).
cell_symbol(sph_w, wSph).
cell_symbol(cube_b, bCub).
cell_symbol(cil_b, bCyl).
cell_symbol(cone_b, bCon).
cell_symbol(sph_b, bSph).
cell_symbol(_, _):- fail.

/**
 * write_symbol(+Cell)
 * 
 * Writes the board cell in its display form
 */
write_symbol(Cell):-
    cell_symbol(Cell, Symb),
    write(Symb).

/**
 * player(+PlayerDisplay, -Player)
 * 
 * Succeeds if the player has a display form.
 */
player('1 - White Pieces', 1).
player('2 - Black Pieces', 2).

/**
 * display_row(+Row)
 * 
 * Displays row received.
 */
display_row([]):- !.
display_row([Cell | RestRow]):-
    write_symbol(Cell),
    write(' | '),
    display_row(RestRow).

/**
 * display_rows(+Rows: list, RowNumber: integer)
 * 
 * Displays rows received and its number.
 */
display_rows([], _):- !.
display_rows([Row | OtherRows], RowNumber):-
    format('\t|  ~d  | ', RowNumber),
    NewRowNumber is RowNumber + 1,
    display_row(Row), 
    format(' ~d  |',RowNumber), nl,
    write('\t ----- ------ ------ ------ ------ ------ \n'),
    display_rows(OtherRows, NewRowNumber).
    
/**
 * Displays the meanings used to display the game board.
 */
display_meanings:-
    write('Meanings:\n'),
    write('wCyl -> White cylinder\t\t'),
    write('bCyl -> Black cylinder\n'),

    write('wCub -> White cube\t\t'),
    write('bCub -> Black cube\n'),

    write('wCon -> White cone\t\t'),
    write('bCon -> Black cone\n'),

    write('wSph -> White sphere\t\t'),
    write('bSph -> Black sphere\n\n').

/**
 * display_board(+Board)
 * 
 * Displays game board.
 */
display_board(Board):-
    write('\n\n\n\t       ---------------------------\n'),
    write('\t       ---------- Board ----------\n'),
    write('\t       ---------------------------\n\n'),
    write('\t       ------ ------ ------ ------\n'),
    write('\t      |  A.  |  B.  |  C.  |  D.  |\n'),
    write('\t ----- ------ ------ ------ ------ -----\n'),
    display_rows(Board, 1),
    write('\t      |  A.  |  B.  |  C.  |  D.  |\n'),
    write('\t       ------ ------ ------ ------\n'),
    display_meanings.

/**
 * display_game(+Board, +Player)
 * 
 * Displays game board and the next player to play.
 */
display_game(Board, Player):-
   % write('\33\[2J'),
    display_board(Board),
    write('Next player: '),
    player(PlayerDisplay, Player),
    write(PlayerDisplay),
    nl, nl, nl.

/**
 * display_game_over(+Board, +Player)
 * 
 * Displays game board and the winner.
 */
display_game_over(Board, Player):-
    %write('\33\[2J'),
    display_board(Board),
    write('\n   ____                         ___\n'),               
    write('  / ___| __ _ _ __ ___   ___   / _ \\__   _____ _ __ \n'),
    write(' | |  _ / _` | \'_ ` _ \\ / _ \\ | | | \\ \\ / / _ \\ \'__|\n'),
    write(' | |_| | (_| | | | | | |  __/ | |_| |\\ V /  __/ |\n'),   
    write('  \\____|\\__,_|_| |_| |_|\\___|  \\___/  \\_/ \\___|_|\n'),
    write('\n\n\t ** Winner: Player '),
    player(PlayerDisplay, Player),
    write(PlayerDisplay),
    write('**\n\n').  

/**
 * display_game_over(+Board)
 * 
 * Displays game board and the tie message.
 */
display_tie(Board):-
    write('\33\[2J'),
    display_board(Board),    
    write('\t  _____ _\n'),      
    write('\t |_   _(_) ___ \n'),
    write('\t   | | | |/ _ \\\n'),
    write('\t   | | | |  __/\n'),
    write('\t   |_| |_|\\___|\n'),        
 
    write('\n\n ** No more valid moves available **\n\n').

/**
 * Displays main menu.
 */
display_menu:-
    write('\t       ---------------------------\n'),
    write('\t      |          QUANTIK          |\n'),
    write('\t      |      1:Human vs Human     |\n'),
    write('\t      |    2:Human vs Computer    |\n'),
    write('\t      |   3:Computer vs Computer  |\n'),
    write('\t      |        4:Exit Game        |\n'),
    write('\t       ---------------------------\n').

/**
 * Displays level menu.
 */
display_level:-
    write('\t       ---------------------------\n'),
    write('\t      |          QUANTIK          |\n'),
    write('\t      |          1:Easy           |\n'),
    write('\t      |         2:Medium          |\n'),
    write('\t       ---------------------------\n').

/**
 * Displays message when an invalid move occurs.
 */
display_move_error:-
    write('\n\t ---------------------------------------\n'),
    write('\t|         Something went wrong!         |\n'),
    write('\t|                 Hint:                 |\n'),
    write('\t|     *That cell has already a piece    |\n'),
    write('\t|     *Your opponent has already put    |\n'),
    write('\t|       the same solid in that line,    |\n'),
    write('\t|            column or quadrant         |\n'),
    write('\t|     *You have already put the two     |\n'),
    write('\t|   pieces of that shape in the board   |\n'),
    write('\t|                                       |\n'),
    write('\t|        **Choose another move**        |\n'),
    write('\t ---------------------------------------\n\n').