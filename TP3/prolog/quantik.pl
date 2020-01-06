:- consult('display.pl').
:- consult('logic.pl').
:- consult('validation.pl').
:- consult('rules.pl').
:- consult('computer_play.pl').
:- use_module(library(random)).
:- use_module(library(system)).

/**
 * Starts the game, displaying the main menu and reading 
 * and validating the option chosen.
 */
play:-
    repeat,
    display_menu,
    read_option(Option),
    valid_option(Option).

/**
 * read_option(-Option: integer)
 * 
 * Reads the option chosen.
 */
read_option(Option):-
    read(Option).

/**
 * valid_option(+Option: integer)
 * 
 * Validates option read.
 */
valid_option(Option):-
    (\+(var(Option)), 
    number(Option),
    option_chosen(Option)
    ;
    write('\t       Invalid Option! Try again..\n\n'),
    fail).

/**
 * option_chosen(+Option: integer)
 * 
 * According to the option read, begins the selected game.
 */
option_chosen(1):- 
    initial_board(Board),
    random_select(Player, [1, 2], _),
    display_game(Board, Player),
    game_loop(Player, Board, h, h, _).

option_chosen(2):- 
    ask_level(Level),
    initial_board(Board),
    random_select(Player, [1, 2], _),
    display_game(Board, Player),
    game_loop(Player, Board, h, c, Level).

option_chosen(3):- 
    ask_level(Level),
    initial_board(Board),
    random_select(Player, [1, 2], _),
    display_game(Board, Player),
    game_loop(Player, Board, c, c, Level).

option_chosen(4):-
    write('Exiting game...\n').

/**
 * ask_level(-Level: integer)
 * 
 * Shows level menu and reads and validate level chosen.
 */
ask_level(Level):-
    display_level,
    read_option(Level),
    valid_level(Level).

/**
 * valid_level(+Level: integer)
 * 
 * Validates level read.
 */
valid_level(Level):-
    (\+(var(Level)), 
    number(Level),
    dificulty_level(Level)
    ;
    write('\t       Invalid Option! Try again..\n\n'),
    fail).

/**
 * dificulty_level(+Level)
 * 
 * Existing levels.
 */
dificulty_level(1).
dificulty_level(2).

