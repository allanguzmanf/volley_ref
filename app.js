(function () {
  var KEY = 'volleyRefState';
  // lineup[i] = player at position i+1. Position 1 is the server.
  // Court: front row 4 3 2, back row 5 6 1.
  var ORDER = [3, 2, 1, 4, 5, 0]; // lineup indexes in display order (pos 4,3,2,5,6,1)

  function fresh() {
    return {
      teams: [
        { name: 'Home', score: 0, lineup: ['1', '2', '3', '4', '5', '6'] },
        { name: 'Away', score: 0, lineup: ['1', '2', '3', '4', '5', '6'] }
      ],
      serving: 0
    };
  }

  var state = load();
  var history = [];

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.teams && s.teams.length === 2) return s;
    } catch (e) {}
    return fresh();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function snapshot() {
    history.push(JSON.stringify(state));
    if (history.length > 200) history.shift();
  }
  function rotate(t) {
    var l = state.teams[t].lineup;
    l.push(l.shift()); // position 2 moves to 1, 1 moves to 6
  }
  function point(t) {
    snapshot();
    state.teams[t].score++;
    if (state.serving !== t) {
      state.serving = t;
      rotate(t);
    }
    render();
  }
  function minus(t) {
    snapshot();
    state.teams[t].score = Math.max(0, state.teams[t].score - 1);
    render();
  }

  var root = document.getElementById('teams');

  function render() {
    save();
    root.innerHTML = '';
    state.teams.forEach(function (team, t) {
      var el = document.createElement('section');
      el.className = 'team' + (state.serving === t ? ' serving' : '');
      var h = document.createElement('h2');
      var name = document.createElement('input');
      name.value = team.name;
      name.style.cssText = 'font:inherit;background:transparent;color:#fff;border:0;border-bottom:1px solid #456;width:50%';
      name.onchange = function () { snapshot(); team.name = name.value; save(); };
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'SERVING';
      h.appendChild(name); h.appendChild(badge);
      el.appendChild(h);

      var sc = document.createElement('div');
      sc.className = 'score';
      sc.textContent = team.score;
      el.appendChild(sc);

      var row = document.createElement('div');
      row.className = 'row';
      row.appendChild(btn('+ Point', 'point', function () { point(t); }));
      row.appendChild(btn('-1', 'minus', function () { minus(t); }));
      el.appendChild(row);

      var sl = document.createElement('div');
      sl.className = 'server-line';
      sl.textContent = state.serving === t ? 'Server: #' + team.lineup[0] : '';
      el.appendChild(sl);

      var court = document.createElement('div');
      court.className = 'court';
      ORDER.forEach(function (i) {
        var p = document.createElement('div');
        p.className = 'pos' + (i === 0 && state.serving === t ? ' server' : '');
        var lab = document.createElement('small');
        lab.textContent = 'Pos ' + (i + 1) + (i === 0 ? ' (serve)' : '');
        var inp = document.createElement('input');
        inp.value = team.lineup[i];
        inp.setAttribute('inputmode', 'numeric');
        inp.setAttribute('aria-label', team.name + ' position ' + (i + 1));
        inp.onchange = function () { snapshot(); team.lineup[i] = inp.value; render(); };
        p.appendChild(lab); p.appendChild(inp);
        court.appendChild(p);
      });
      el.appendChild(court);

      var r = document.createElement('div');
      r.className = 'row';
      r.appendChild(btn('Rotate', '', function () { snapshot(); rotate(t); render(); }));
      r.appendChild(btn('Serve', '', function () { snapshot(); state.serving = t; render(); }));
      el.appendChild(r);
      root.appendChild(el);
    });
  }

  function btn(text, cls, fn) {
    var b = document.createElement('button');
    b.textContent = text;
    if (cls) b.className = cls;
    b.onclick = fn;
    return b;
  }

  document.getElementById('undo').onclick = function () {
    if (history.length) { state = JSON.parse(history.pop()); render(); }
  };
  document.getElementById('swap').onclick = function () {
    snapshot();
    state.teams.reverse();
    state.serving = 1 - state.serving;
    render();
  };
  document.getElementById('reset').onclick = function () {
    if (!confirm('Start a new set? Scores reset, lineups and names are kept.')) return;
    snapshot();
    state.teams.forEach(function (t) { t.score = 0; });
    render();
  };

  render();
})();
