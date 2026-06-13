(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.L1 = {
    id:'L1', name:'Level 1 宜居地带', class:1, danger:'实体出没', safe:false,
    entities:['smiler','skinstealer'],
    nodes:{
      entry:{ id:'entry',
        text:'你撞穿墙，摔进一个空旷得多的空间：裸露的水泥柱、堆叠的木箱、远处管道滴水。这里能住人——也意味着，有别的东西住在这里。',
        onEnter:[['sanity',5]],
        choices:[
          { label:'寻找可据守的角落', goto:'hub' },
          { label:'循着滴水声探索', goto:'pipes' },
        ]},
      hub:{ id:'hub', safe:true,
        text:'你找到一个三面是墙的凹间，搬来木箱堵住开口。这里相对安全，可以喘口气。',
        choices:[
          { label:'休整（存档点）', goto:'hub', noTick:true, effects:[['sanity',8]] },
          { label:'去管道区找水', goto:'pipes' },
          { label:'前往更深处的裂口', goto:'bottleneck' },
        ]},
      pipes:{ id:'pipes',
        text:'管道在滴落浑浊的水。一个身影从阴影里走出，朝你挥手："终于又见到活人了！"——他看起来太正常了。',
        onEnter:[['sanity',-4]],
        choices:[
          { label:'用镜子照他', requires:(s)=>!!s.inv.mirror, goto:'reveal_skinstealer', effects:[['flag','mirror_used',true]] },
          { label:'递给他一瓶杏仁水·红', requires:(s)=>!!s.inv.almond_red, goto:'reveal_skinstealer', effects:[['take','almond_red',1]] },
          { label:'信任他，跟他走', goto:'skinstealer_death' },
          { label:'保持距离，绕开', goto:'hub', effects:[['sanity',-3]] },
        ]},
      reveal_skinstealer:{ id:'reveal_skinstealer',
        text:'镜中没有他的倒影。"他"的笑僵在脸上，皮肤下的东西开始蠕动——剥皮者。你转身就跑，它没有追来（它只在伪装时动手）。',
        choices:[ { label:'退回安全角', goto:'hub', effects:[['sanity',-6]] } ]},
      skinstealer_death:{ id:'skinstealer_death',
        text:'你没有验过他。走到无人处时，"他"侧过头，咧开一道不属于人的笑。',
        choices:[ { label:'……', ending:'replaced' } ]},
      bottleneck:{ id:'bottleneck',
        text:'空间尽头是一道向下的裂口，暖风从里面涌出，带着甜腻的派对气味（下面是 Level Fun），也有一条积水的管道通向更黑的深处（Level 2）。墙角蜷着一个人——他胸口别着 M.E.G. 的徽记。',
        choices:[
          { label:'上前与 M.E.G. 探员交谈', goto:'meg' },
          { label:'钻进甜味的暖风（→ Level Fun）', goto:'LFun:entry' },
          { label:'走积水管道（→ Level 2）', goto:'L2:entry' },
        ]},
      meg:{ id:'meg',
        text:'"独行很难活，"他说，"我们 M.E.G. 在做层级测绘。给你点补给——想清楚要不要加入。"他递来杏仁水和一面小镜子。',
        onEnter:[['give','almond_grey',1],['give','mirror',1],['flag','met_meg',true],['trust',2]],
        choices:[
          { label:'答应加入 M.E.G.', requires:(s)=>s.trust>=2, ending:'join_meg' },
          { label:'道谢，独自继续', goto:'bottleneck' },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
