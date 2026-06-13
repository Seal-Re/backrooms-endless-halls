(function (g) {
  const GAME = (g.GAME = g.GAME || {});
  GAME.DROP_POOL = ['L0:corridors','L1:entry','L2:entry','L6:entry'].filter(t=>{
    const i=t.indexOf(':'); const lv=GAME.levels[t.slice(0,i)]; return lv && lv.nodes[t.slice(i+1)];
  });
})(typeof window !== 'undefined' ? window : globalThis);
