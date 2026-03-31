"""
minimax.py — Algorithme Minimax avec élagage Alpha-Bêta
"""

from utils import check_winner, is_full


def minimax(board, is_maximizing, alpha, beta):
    """
    Algorithme Minimax avec élagage Alpha-Bêta.

    - X est le joueur MAXIMISANT (veut un score élevé)
    - O est le joueur MINIMISANT (veut un score bas)

    Scores :
      +1  → X gagne
      -1  → O gagne
       0  → Match nul

    Paramètres :
      board          : état actuel du plateau (liste de 9)
      is_maximizing  : True si c'est au tour de X, False si c'est O
      alpha          : meilleure valeur garantie pour X
      beta           : meilleure valeur garantie pour O

    Retourne le score optimal depuis cet état.
    """
    # Cas terminaux
    winner = check_winner(board)
    if winner == 'X':
        return 1
    if winner == 'O':
        return -1
    if is_full(board):
        return 0

    if is_maximizing:
        # Tour de X — on cherche le score maximum
        best = -float('inf')
        for i in range(9):
            if board[i] is None:
                board[i] = 'X'
                score = minimax(board, False, alpha, beta)
                board[i] = None          # backtrack
                best = max(best, score)
                alpha = max(alpha, best)
                if beta <= alpha:
                    break                # élagage bêta
        return best
    else:
        # Tour de O — on cherche le score minimum
        best = float('inf')
        for i in range(9):
            if board[i] is None:
                board[i] = 'O'
                score = minimax(board, True, alpha, beta)
                board[i] = None          # backtrack
                best = min(best, score)
                beta = min(beta, best)
                if beta <= alpha:
                    break                # élagage alpha
        return best


def get_best_move(board):
    """
    Retourne le meilleur coup pour X depuis l'état donné.
    Utile pour l'interface jouable en mode IA.

    Retourne l'index (0-8) du meilleur coup.
    """
    best_score = -float('inf')
    best_move = None

    for i in range(9):
        if board[i] is None:
            board[i] = 'X'
            score = minimax(board, False, -float('inf'), float('inf'))
            board[i] = None
            if score > best_score:
                best_score = score
                best_move = i

    return best_move