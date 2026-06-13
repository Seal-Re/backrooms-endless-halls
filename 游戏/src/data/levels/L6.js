(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.L6 = {
    id:'L6', name:'Level 6 熄灯', class:3, danger:'绝对黑暗·感官剥夺', safe:false,
    entities:['smiler','hound'],
    nodes:{
      entry:{ id:'entry',
        text:'门在你身后合上的那一刻，光就没了——不是变暗，是被一口吞掉。你伸手不见五指。脚下是光滑冰冷的混凝土，指尖贴上去的墙也是。极度的寂静压在耳膜上，你甚至听得见自己心跳的钝响。你站在一条看不见尽头的狭窄走廊里。官方记录称本层无确认实体——可黑暗里的东西，从不在乎记录。',
        variants:{
          dread:'黑暗不是空的。它有重量，贴着你的后颈。寂静里好像有人在很远处叫你的名字——用你母亲的声音。但她不在这里。她不该在这里。',
          broken:'你睁着眼，闭着眼，没有区别。黑里有无数张脸贴着你转。它们在数你的呼吸。你已经在这条走廊里走了多久了？一天？一年？你还记得光是什么样吗？'
        },
        onEnter:[['sanity',-6]],
        choices:[
          { label:'伸手贴住右墙，循触觉摸索前进', goto:'right_wall', effects:[['stamina',-4]] },
          { label:'打开手电，看清周围', requires:(s)=>!!s.inv.flashlight, goto:'flashlight_on' },
          { label:'站在原地，先适应黑暗', goto:'stand_still' },
        ]},

      stand_still:{ id:'stand_still',
        text:'你不动，等眼睛适应——但没有光可以适应。时间在纯黑里失去刻度。寂静开始"播放"东西：脚步、低语、某个房间里隐约的派对乐声。你分不清哪些是真的。',
        onEnter:[['sanity',-8]],
        choices:[
          { label:'告诉自己那全是幻觉，开始摸墙走', goto:'right_wall', effects:[['sanity',4]] },
          { label:'循着派对乐声走过去', goto:'lure_voice' },
        ]},

      right_wall:{ id:'right_wall',
        text:'你贴着右墙一步步挪。混凝土平滑得没有一丝接缝，凉意顺着掌心爬上手臂。走了不知多久，指尖忽然探进一道凹陷——一个向左的岔口。同时，前方某处传来很轻的、有节奏的"嗒、嗒"——像有什么东西在硬地上慢慢踱步。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'拐进左边岔口', goto:'rest_alcove' },
          { label:'无视岔口，继续沿原墙直行', goto:'corridor_fork' },
          { label:'喝一口杏仁水·灰压压神', requires:(s)=>!!s.inv.almond_grey, goto:'right_wall', noTick:true, effects:[['take','almond_grey',1],['thirst',-40],['sanity',12],['stamina',20]] },
        ]},

      rest_alcove:{ id:'rest_alcove',
        text:'岔口尽头是一个三面封死的小凹间。你缩进去，背靠墙坐下。在这个角落里，声音从三面被混凝土挡住，只有一个开口要防。这是你在熄灯里能找到的、最接近"安全"的地方。你摸到地上有人留下的东西。',
        onEnter:(s)=> s.flags.found_alcove ? [] : [['give','battery',1],['flag','found_alcove',true]],
        choices:[
          { label:'休整（存档点）', goto:'rest_alcove', noTick:true, effects:[['sanity',8]] },
          { label:'摸索回主走廊', goto:'corridor_fork', effects:[['stamina',-3]] },
        ]},

      flashlight_on:{ id:'flashlight_on',
        text:'你按下开关。光柱亮起——只亮了半秒，就像被黑暗"喝"掉一样迅速衰减、变红、熄灭。这一层会吞噬外来的光。但就在那半秒的微光里，走廊深处，你瞥见一抹悬在半空、咧到耳根的——笑。它在黑暗里冲你笑。',
        onEnter:[['flag','saw_smile',true],['sanity',-5]],
        choices:[
          { label:'盯着那个笑，想看清它是什么（错误）', goto:'smiler_stare' },
          { label:'立刻别开脸，贴墙原地静止', goto:'right_wall', effects:[['sanity',-4]] },
          { label:'换一节电池，再试一次', requires:(s)=>!!s.inv.battery, goto:'flashlight_again', effects:[['take','battery',1]] },
        ]},

      flashlight_again:{ id:'flashlight_again',
        text:'新电池，同样的结果——光亮起，被吞掉，熄灭。但这半秒足够你看清：那抹笑还在原地，没有靠近。它不靠光行动，它等你看它。这层的规矩很清楚：光救不了你，看它才会害死你。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'闭眼，凭记忆摸黑绕开它', goto:'corridor_fork', effects:[['sanity',2]] },
          { label:'再看一眼，确认它走了没（错误）', goto:'smiler_stare' },
        ]},

      smiler_stare:{ id:'smiler_stare',
        text:'你盯住那个笑。它一直咧着，纹丝不动，就等你这一眼。你越看，它越大，越亮，填满你整个视野——Smiler（微笑者）只需要你愿意直视黑暗中的它。它不来找你，是你把自己交了出去。那笑，是你看见的最后一样东西。',
        choices:[ { label:'……', ending:'smiler_eaten' } ]},

      corridor_fork:{ id:'corridor_fork',
        text:'走廊在前方分成两支。你听见两种声音：右支深处，有极轻微、一涨一落的"哗——哗——"，像很远的海浪；左支里，有一个人在用平静的声音说话："这边，往这边走，我知道出口。"那声音温暖、可信，甚至有点耳熟。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'循着海浪声走右支', goto:'wave_stairwell' },
          { label:'跟着说话声走左支', goto:'lure_voice' },
          { label:'两边都不信，往回退去找静室', goto:'bottleneck' },
        ]},

      lure_voice:{ id:'lure_voice',
        text:'你朝声音走去。它一直在你前方几步，引着你拐弯、再拐弯。"快到了，"它说，"再走几步。"——可你忽然意识到，它在用你弟弟的声音，而你弟弟从没下来过这里。这是 The Mimics（模仿者），它们在绝对黑暗里完美复制人声，把流浪者诱进死路。前方它们已经围了过来。',
        onEnter:[['sanity',-7],['flag','met_mimics',true]],
        choices:[
          { label:'什么都别说，屏息后退，慢慢摸回岔口', goto:'corridor_fork', effects:[['sanity',-4],['stamina',-3]] },
          { label:'开口质问"你到底是谁"——暴露自己位置（错误）', goto:'mimic_swarm' },
          { label:'给它们一瓶杏仁水·绿，趁它们分神脱身', requires:(s)=>!!s.inv.almond_green, goto:'corridor_fork', effects:[['take','almond_green',1],['sanity',3]] },
        ]},

      mimic_swarm:{ id:'mimic_swarm',
        text:'你一出声，黑暗里立刻响起一模一样的、属于你自己的声音，从四面八方回过来："你到底是谁。你到底是谁。你到底是谁。"它们已经记下了你的嗓子。声音越收越紧，把你裹在正中央。你再也分不清哪句是自己说的。',
        choices:[ { label:'……', ending:'sanity_zero' } ]},

      wave_stairwell:{ id:'wave_stairwell',
        text:'海浪声越来越清晰。你的右手摸到墙体断开——一道向下的楼梯井，潮湿、带着咸腥的风，那是通往更深处（Level 7 的海）的下行口。但就在这时，身后混凝土上传来"哒哒哒"急促的脚步，由远及近——Hound。它靠声音锁定猎物。你脚下的台阶，一踩就会发出回响。',
        onEnter:[['sanity',-5],['flag','near_stairs',true]],
        choices:[
          { label:'转身就往楼梯下狂奔（错误）', goto:'hound_chase' },
          { label:'屏住呼吸，一动不动，等它走', goto:'hound_pass' },
          { label:'摸黑往反方向退回主走廊', goto:'bottleneck', effects:[['stamina',-5],['sanity',-3]] },
        ]},

      hound_chase:{ id:'hound_chase',
        text:'你的脚步在楼梯井里炸成一串回响——对 Hound 来说，那就是一张点亮的地图。它从黑暗里扑下来，比你想象的快得多。在熄灯，制造声音从来不是逃跑，是投降。',
        choices:[ { label:'……', ending:'collapse' } ]},

      hound_pass:{ id:'hound_pass',
        text:'你把呼吸压到最低，僵成一块石头。脚步声从你身侧两步外踱过，停顿，嗅探——然后，缓缓远去，消失在另一条走廊。你在黑暗里站了很久，才敢重新动弹。下行的楼梯就在右手边。',
        onEnter:[['sanity',6]],
        choices:[
          { label:'循着海浪与咸风，走下楼梯（→ 更深处）', goto:'LInf:entry', effects:[['stamina',-6],['sanity',4]] },
          { label:'放弃下行，回去找静室喘口气', goto:'bottleneck' },
        ]},

      bottleneck:{ id:'bottleneck',
        text:'你退回到走廊交汇处。这里风从三个方向涌来，各带不同的气味：一道是楼梯井里咸腥的海风，通向更深的黑；正前方是一面在指尖下微微"发麻"的墙——像没渲染完的纹理，那是回上一层（Level 5）的不稳定出口；而最尽头，混凝土走廊本身仿佛没有终点地向前延伸，叫人想一直走下去，走进无限。',
        variants:{
          dread:'三股风像三只手按在你身上。你已经记不清自己是从哪扇门进来的了。',
          broken:'走廊在你眼前不断生长。墙在退后。无论你朝哪边，路都更长了。你属于这里。一直都是。'
        },
        choices:[
          { label:'走进永无止境的延伸走廊（→ 无限层级）', goto:'LInf:entry', effects:[['stamina',-6],['sanity',-4]] },
          { label:'循咸风走下楼梯井（→ 更深的海）', goto:'wave_stairwell' },
          { label:'撞穿发麻的墙，回到 Level 5', goto:'L5:entry', effects:[['stamina',-8],['sanity',5]] },
          { label:'再回主走廊摸索一圈', goto:'corridor_fork' },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
