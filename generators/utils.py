"""
utils.py — Fonctions utilitaires du plateau de Morpion
"""


def check_winner(board):
    """
    Vérifie s'il y a un gagnant sur le plateau.
    board : liste de 9 éléments — 'X', 'O', ou None
    Retourne 'X', 'O', ou None si personne n'a gagné.
    """
    winning_combos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # colonnes
        [0, 4, 8], [2, 4, 6]               # diagonales
    ]
    for combo in winning_combos:
        a, b, c = combo
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]
    return None


def is_full(board):
    """Retourne True si toutes les cases sont occupées."""
    return all(cell is not None for cell in board)


def is_terminal(board):
    """Retourne True si la partie est terminée."""
    return check_winner(board) is not None or is_full(board)


def count_pieces(board):
    """Retourne le nombre de X et O sur le plateau."""
    x_count = board.count('X')
    o_count = board.count('O')
    return x_count, o_count


def encode_board(board):
    """
    Encode un plateau en 18 features binaires.
    Pour chaque case i (0 à 8) :
      ci_x = 1 si X occupe la case i, sinon 0
      ci_o = 1 si O occupe la case i, sinon 0
    Retourne un dictionnaire avec les 18 features.
    """
    features = {}
    for i in range(9):
        features[f'c{i}_x'] = 1 if board[i] == 'X' else 0
        features[f'c{i}_o'] = 1 if board[i] == 'O' else 0
    return features