(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.L0 = {
    id:'L0', name:'Level 0 阈界', class:1, danger:'孤立致死', safe:false,
    entities:['hound'],
    nodes:{
      entry:{ id:'entry',
        text:'你趴在浸软的地毯上。抬起头——无穷无尽的黄。泛黄的墙纸一直延伸到视线尽头，头顶的荧光灯发出持续的、低频的嗡鸣。你喊了一声，声音被房间吃掉，没有一点回响。',
        variants:{ dread:'……黄。到处是黄。嗡鸣里好像夹着谁在喊你的名字——但这里不该有别人。', broken:'墙在呼吸。地毯在数你的脚步。你一直都在这儿，不是吗？这里不该有别人。这里不该有别人。' },
        choices:[
          { label:'选定一个方向，一直走', goto:'corridors', effects:[['stamina',-5]] },
          { label:'原地坐下，等待救援', goto:'wait' },
        ]},
      wait:{ id:'wait',
        text:'你靠墙坐下。时间在荧光灯的嗡鸣里失去刻度。没有人来。口越来越干。',
        choices:[
          { label:'还是起身去找出口', goto:'corridors' },
          { label:'继续等……（危险）', goto:'wait', effects:[['sanity',-8],['thirst',15]] },
          { label:'放弃', ending:'trapped_l0' },
        ]},
      corridors:{ id:'corridors',
        text:'一模一样的房间，一个接一个。你回头想找来路——身后的布局已经不一样了（边缘移位）。前方岔出两条路：一条尽头的灯在闪烁，另一条没入彻底的黑暗。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'走向闪烁的灯', goto:'flicker' },
          { label:'探入黑暗区找补给', goto:'blackout' },
          { label:'喝一口杏仁水·灰', requires:(s)=>!!s.inv.almond_grey, goto:'corridors', effects:[['take','almond_grey',1],['thirst',-50],['sanity',15],['stamina',30]], noTick:true },
        ]},
      blackout:{ id:'blackout',
        text:'光全部消失。积液没过脚踝。某处传来低沉的、循声而来的喘息——Hound。它靠声音狩猎。',
        onEnter:[['sanity',-8]],
        choices:[
          { label:'屏住呼吸，静止不动', goto:'blackout_safe' },
          { label:'打开手电照路', requires:(s)=>!!s.inv.flashlight, goto:'blackout_light' },
          { label:'转身狂奔', goto:'hound_death' },
        ]},
      blackout_safe:{ id:'blackout_safe',
        text:'你停住。喘息声在两步外徘徊，又缓缓远去。黑暗里你摸到一个被遗弃的背包。',
        onEnter:[['give','almond_grey',1]],
        choices:[ { label:'摸回有光的方向', goto:'flicker', effects:[['sanity',5]] } ]},
      blackout_light:{ id:'blackout_light',
        text:'光柱亮起的瞬间，喘息声骤然加速冲来——Hound 循着你暴露的位置。',
        choices:[
          { label:'立刻关灯静止', goto:'blackout_safe', effects:[['sanity',-6]] },
          { label:'举灯直面（错误）', goto:'hound_death' },
        ]},
      hound_death:{ id:'hound_death',
        text:'你的脚步声就是它的地图。黑暗里，最后一声是你自己的。',
        choices:[ { label:'……', ending:'collapse' } ]},
      flicker:{ id:'flicker',
        text:'闪烁的灯下，有一面墙在轻微地"抖动"——像没渲染完的纹理。这就是传说中的出口：撞穿它，去往 Level 1。',
        choices:[
          { label:'后退几步，全力撞穿', goto:'L1:entry', effects:[['stamina',-10],['sanity',5]] },
          { label:'再去别处看看', goto:'corridors' },
        ]},
      entry_campus:{ id:'entry_campus',
        text:'你伸手扶墙——指尖穿了过去。"刺啦"一声，应急灯的白光变成了泛黄的、嗡鸣的、潮湿的无尽走廊。你也滑了进来。',
        choices:[ { label:'站起来，看看四周', goto:'entry' } ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
