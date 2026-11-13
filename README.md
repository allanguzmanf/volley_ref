# volley_ref

A quick, dependency-free web app for volleyball referees to track player rotation, score and the current server.

## Usage

Open `index.html` in any browser (works on mobile, no build or install). State is saved in localStorage.

- **+ Point**: the serving team just adds a point. If the receiving team wins the rally it is a side-out: they gain the serve and rotate.
- **Server**: shown for the serving team and highlighted at position 1.
- **Rotation**: court shows positions 4 3 2 (front) and 5 6 1 (back). Rotation is clockwise (position 2 moves to 1). Use **Rotate** or **Serve** to correct manually.
- Tap a player number or team name to edit it. Use **-1** to fix a score.
- **Undo** reverts the last action, **Swap sides** swaps the teams, **New set** resets scores.
