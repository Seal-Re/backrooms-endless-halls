(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.endings = GAME.endings || {};
  const E = GAME.endings;
  const mk = (id, title, text) => (E[id] = { id, title, text });
  mk('escape',       '逃回前厅',         '一扇本不该存在的门后，是熟悉的雨夜街道。你回来了——但你知道，墙后的嗡鸣再不会真正消失。');
  mk('trapped_l0',   '困死阈界',         '杏仁水喝光了。黄色的走廊没有尽头，也没有人。你成了那 85% 的一员。');
  mk('sanity_zero',  '成为后室的一部分', '你分不清哪句低语是自己的了。墙纸的纹路开始随你呼吸起伏。你一直都在这里，不是吗？');
  mk('collapse',     '力竭',             '双腿再不肯前进。荧光灯的嗡鸣是你听到的最后声音。');
  mk('replaced',     '被剥皮者取代',     '"同伴"侧过头，咧开一道不属于人的笑。你没用镜子验过它。');
  mk('smiler_eaten', '被微笑吞噬',       '黑暗里那道笑越来越近。你直视了它。');
  mk('join_meg',     '加入 M.E.G.',      '探险队收留了你。你学会了在这里活下去，并把杏仁水分给下一个迷失者。');
  mk('red_loop',     '永坠红房间',       '又一次推开那扇门，又一次是同一条走廊。第几次了？数字也开始撒谎。');
  mk('reach_end',    '抵达终焉',         '尽头是一片温暖的虚无。你停下脚步，不再害怕。这里就是 The End。');
  mk('cult_lost',    '迷失于邪教',       'The Lost 教众围拢过来，许诺安宁。你交出了自己——连同名字。');
})(typeof window !== 'undefined' ? window : globalThis);
