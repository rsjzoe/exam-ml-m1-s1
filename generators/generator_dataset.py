"""
generator.py — Générateur principal du dataset Morpion
Utilise minimax.py et utils.py
"""

import os
import pandas as pd
from minimax import minimax
from utils import is_terminal, count_pieces, encode_board


def generate_dataset():
    """
    Parcourt récursivement tous les états valides du Morpion
    et labellise ceux où c'est au tour de X via Minimax.

    Retourne une liste de dictionnaires (une ligne par état).
    """
    rows    = []       # stocke toutes les lignes du dataset
    visited = set()    # évite les doublons

    def explore(board):
        """
        Fonction récursive qui explore tous les états possibles.
        board : état courant (liste de 9 éléments)
        """
        state_key = tuple(board)
        if state_key in visited:
            return
        visited.add(state_key)

        if is_terminal(board):
            return

        x_count, o_count = count_pieces(board)
        x_turn = (x_count == o_count)

        if x_turn:
            score = minimax(board, True, -float('inf'), float('inf'))

            x_wins  = 1 if score ==  1 else 0
            is_draw = 1 if score ==  0 else 0

            row = encode_board(board)
            row['x_wins']  = x_wins
            row['is_draw'] = is_draw
            rows.append(row)

        next_player = 'X' if x_turn else 'O'
        for i in range(9):
            if board[i] is None:
                board[i] = next_player
                explore(board)
                board[i] = None  # backtrack

    explore([None] * 9)
    return rows


def main():
    print("Génération du dataset en cours...")
    rows = generate_dataset()

    os.makedirs('ressources', exist_ok=True)

    columns = (
        [f'c{i}_x' for i in range(9)] +
        [f'c{i}_o' for i in range(9)] +
        ['x_wins', 'is_draw']
    )

    df = pd.DataFrame(rows, columns=columns)

    output_path = 'ressources/dataset.csv'
    df.to_csv(output_path, index=False)

    print(f"Dataset généré avec succès !")
    print(f"  Nombre d'états (lignes) : {len(df)}")
    print(f"  Nombre de colonnes      : {len(df.columns)}")
    print(f"  Fichier exporté         : {output_path}")
    print()
    print("Distribution des cibles :")
    print(f"  x_wins  = 1 : {df['x_wins'].sum()} états "
          f"({df['x_wins'].mean()*100:.1f}%)")
    print(f"  is_draw = 1 : {df['is_draw'].sum()} états "
          f"({df['is_draw'].mean()*100:.1f}%)")
    o_wins = (df['x_wins'] + df['is_draw'] == 0).sum()
    print(f"  o_wins      : {o_wins} états "
          f"({o_wins/len(df)*100:.1f}%)")
    print()
    print("Aperçu des 3 premières lignes :")
    print(df.head(3).to_string())


if __name__ == '__main__':
    main()