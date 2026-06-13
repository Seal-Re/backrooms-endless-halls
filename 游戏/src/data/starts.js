(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.starts = GAME.starts || {};
  GAME.starts.warehouse = { id:'warehouse', label:'仓库夜班', level:'L0', node:'entry',
    inv:{ almond_grey:2, flashlight:1, battery:2 },
    intro:'加完夜班，仓库 B 区最里头那条没人走的过道。你踩到一块松动的地砖——' };
  GAME.starts.campus = { id:'campus', label:'校园走廊', level:'L0', node:'entry_campus',
    inv:{ almond_grey:1, battery:1 },
    intro:'深夜的教学楼，应急灯惨白。你拐进一条从没注意过的走廊——' };
  GAME.starts.hotel = { id:'hotel', label:'酒店电梯（高难）', level:'L5', node:'entry',
    inv:{ almond_grey:1 },
    intro:'电梯数字跳过了你按的楼层。门开时，地毯的花纹不对——' };
})(typeof window !== 'undefined' ? window : globalThis);
