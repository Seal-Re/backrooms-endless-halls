(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.L2 = {
    id:'L2', name:'Level 2 废弃公共带', class:3, danger:'实体密布·趋光致死', safe:false,
    entities:['deathmoth','wretch'],
    nodes:{
      entry:{ id:'entry',
        text:'积水的管道把你吐进一条狭窄的通道。空气闷热、潮湿，混着铁锈和霉味。两侧是腐朽的混凝土墙，墙上、天花板上密布着早已停转的工业机械。一盏荧光灯在前方闪烁，发出橙白色的、不连贯的嗡鸣，再往前——是一段没有灯的黑暗。通道以四十五度角折向两侧，规整得像有人用尺子量过。',
        variants:{
          dread:'管道把你吐了出来。闷热。机械停着，但你总觉得有一台在你背后悄悄转了半圈。荧光灯一闪一闪，每次熄灭，黑暗里都好像多站了一个东西。',
          broken:'你又被吐了出来。第几次了？墙是棕的，灯是橙的，黑是黑的。机械们在记你的脚步。别开灯。它们喜欢光。别开灯。别——'
        },
        onEnter:[['sanity',-3]],
        choices:[
          { label:'走向闪烁的荧光灯', goto:'junction' },
          { label:'摸黑探入无灯的通道', goto:'dark_hall' },
        ]},
      junction:{ id:'junction',
        text:'你走到那盏挣扎的荧光灯下。这里是一个四十五度的岔口：一条通道墙上漆着褪色的紫色箭头，另一条堆满了油桶和缠绕的延长线。脚边散落着工具和碎玻璃，踩上去会咔咔作响。墙面一碰，指尖就沾上泥棕色的残渣。',
        choices:[
          { label:'顺着紫色箭头走', goto:'purple_lamp' },
          { label:'翻找油桶和杂物堆', goto:'scavenge' },
          { label:'回到管道入口那侧', goto:'entry' },
        ]},
      scavenge:{ id:'scavenge',
        text:'你蹲下翻找。大多是锈死的金属零件，但一个翻倒的工具箱里有惊喜：一支手电筒，还有几节电池滚在角落。停电之前，有人把这些落在了这里。',
        onEnter:[['give','flashlight',1],['give','battery',1],['stamina',-4]],
        choices:[
          { label:'收好手电，继续探索', goto:'junction', effects:[['sanity',3]] },
        ]},
      purple_lamp:{ id:'purple_lamp',
        text:'紫色应急灯在通道尽头幽幽亮着——这是大停电后唯一还供着电的标识，指向可通行区。灯下是一扇半开的金属门，里面像是个被遗弃的小据点：发霉的睡袋、空罐头、一张钉在墙上、字迹被水泡花的地图，角落还有半块流浪者援助会的木牌。',
        onEnter:[['sanity',4]],
        choices:[
          { label:'进入据点歇脚', goto:'safehouse' },
          { label:'不进，沿紫灯继续深入', goto:'deep_tunnel' },
        ]},
      safehouse:{ id:'safehouse',
        text:'你拉过木箱顶住门，在紫色应急灯的微光里坐下。机械的嗡鸣被门挡在了外面。这里不算安全，但至少能喘口气、记下走过的路。墙上的地图角落写着一行小字："灯=死。摸黑走。"',
        choices:[
          { label:'休整（存档点）', goto:'safehouse', noTick:true, effects:[['sanity',8]] },
          { label:'翻找据点里的补给', requires:(s)=>!s.flags.l2_looted, goto:'safehouse_loot' },
          { label:'离开据点，沿紫灯深入', goto:'deep_tunnel' },
        ]},
      safehouse_loot:{ id:'safehouse_loot',
        text:'你在睡袋下摸到一个没被搬空的应急包：两瓶杏仁水·灰，还有一小袋火盐。罐头都空了，但水是真的。你把残渣在裤腿上擦掉。',
        onEnter:[['give','almond_grey',2],['give','firesalt',1],['flag','l2_looted',true]],
        choices:[
          { label:'回到据点', goto:'safehouse' },
        ]},
      deep_tunnel:{ id:'deep_tunnel',
        text:'紫灯一盏接一盏，越来越稀疏，间隔的黑暗越来越长。隧道始终以五米的整数倍折转，欧几里得得令人安心，又令人不安。在两盏紫灯之间最深的一段黑里，你听见极轻的振翅声——很多翅膀，干燥的、纸一样的扑动。空气里浮着细小的鳞粉。',
        onEnter:[['sanity',-6]],
        choices:[
          { label:'打开手电照清前路', requires:(s)=>!!s.inv.flashlight, goto:'moth_light' },
          { label:'保持黑暗，贴墙慢慢挪过去', goto:'moth_dark' },
          { label:'退回紫灯下等振翅声远去', goto:'purple_lamp', effects:[['sanity',-4],['stamina',-4]] },
        ]},
      moth_light:{ id:'moth_light',
        text:'光柱一亮，黑暗瞬间活了过来。无数 Death Moth（死亡飞蛾）从管道缝隙里涌出，全部朝着你手中的光俯冲——它们趋光，而你恰好成了这条隧道里唯一的太阳。鳞粉糊住你的口鼻，翅膀拍打你的眼睛，你想扔掉手电，但它们已经裹住了你。',
        onEnter:[['sanity',-15]],
        choices:[
          { label:'死死攥住手电，想看清出路（错误）', goto:'moth_death' },
          { label:'把发亮的手电狠狠扔向远处，趁机扑进黑暗', requires:(s)=>!!s.inv.flashlight, goto:'moth_escape', effects:[['take','flashlight',1],['stamina',-12]] },
        ]},
      moth_death:{ id:'moth_death',
        text:'你举着光，它们就追着光。最后你连自己举着的是什么都看不清了——只有铺天盖地的、干燥的扑动，和喉咙里越积越厚的鳞粉。光是它们的规则，而你违反了黑暗。',
        choices:[
          { label:'……', ending:'collapse' },
        ]},
      moth_escape:{ id:'moth_escape',
        text:'手电飞出去，光在十几米外砸在墙上。整片蛾群"哗"地转向那个发亮的点，把你留在了重新降临的黑暗里。你蜷在墙根剧烈咳嗽，吐出满口鳞粉，听着远处的振翅声渐渐凝成一团。你活了下来——但手电没了，往后只能摸黑。',
        onEnter:[['sanity',-8]],
        choices:[
          { label:'摸黑继续，寻找出口', goto:'corridor_ambush' },
        ]},
      moth_dark:{ id:'moth_dark',
        text:'你不敢点亮任何东西。贴着冰凉湿滑的墙，一寸一寸地挪。鳞粉的振翅声在头顶盘旋，却始终找不到目标——没有光，它们就找不到你。漫长的几分钟后，你挪进了下一盏紫灯的安全光晕里。蛾群被甩在身后的黑暗中。',
        onEnter:[['sanity',2]],
        choices:[
          { label:'继续前行', goto:'corridor_ambush' },
        ]},
      corridor_ambush:{ id:'corridor_ambush',
        text:'通道变得更窄、更脏。地上的积水里漂着啃剩的骨头和毛发。你刚拐过一个四十五度的弯，黑暗的低处就传出此起彼伏的吱叫与爪子刮擦混凝土的声音——Wretch（尸鼠），成群结队，专挑这种逼仄的走廊伏击落单的旅人。它们已经闻到你了。',
        onEnter:[['sanity',-7]],
        choices:[
          { label:'撒一把火盐划出一道隔离线', requires:(s)=>!!s.inv.firesalt, goto:'wretch_repel', effects:[['take','firesalt',1]] },
          { label:'丢出一瓶杏仁水引开它们，趁乱冲过', requires:(s)=>!!s.inv.almond_grey, goto:'wretch_distract', effects:[['take','almond_grey',1]] },
          { label:'低头硬冲过鼠群', goto:'wretch_swarm' },
        ]},
      wretch_repel:{ id:'wretch_repel',
        text:'火盐在积水里嘶嘶作响，腾起一道刺鼻的白烟。尸鼠的吱叫变成了惊惶的尖叫，潮水般退回黑暗。你踩着那条短暂的隔离线快步穿过通道，盐烟在身后弥散。它们没有追上来。',
        onEnter:[['sanity',3]],
        choices:[
          { label:'穿过通道，前方有强烈气流', goto:'bottleneck' },
        ]},
      wretch_distract:{ id:'wretch_distract',
        text:'玻璃瓶在远处碎裂，杏仁水的甜腥味在湿热的空气里炸开。鼠群"轰"地朝声音和气味涌去。你贴着对侧的墙拼命冲刺，爪子刮擦声在身后追了几步，又被食物的诱惑拽了回去。你跌跌撞撞地冲出了这段走廊。',
        onEnter:[['stamina',-10],['sanity',-2]],
        choices:[
          { label:'喘着气向前，前方有强烈气流', goto:'bottleneck' },
        ]},
      wretch_swarm:{ id:'wretch_swarm',
        text:'你低头猛冲。第一只咬住小腿，第二只攀上后背，然后是第十只、第百只。狭窄的走廊里没有躲闪的余地，黑暗本身仿佛长出了无数牙齿。你的奔跑变成了倒下，而它们从不挑食。',
        choices:[
          { label:'……', ending:'sanity_zero' },
        ]},
      bottleneck:{ id:'bottleneck',
        text:'通道在前方豁然分成三岔，每一岔都有不同的气流。左侧一扇门缝里渗出冷而潮的霉味，门上残留着无标记门特有的、毫无规律的划痕（那是回 Level 1 的方向）。正前方是一扇沉重的金属门，门后传来更深、更冷的回声，像无尽下行的楼梯井——下面是 Level 3。右侧墙上一盏蓝色闪灯有节奏地明灭，门缝里透出与这里截然不同的光。',
        onEnter:[['flag','reached_l2_hub',true]],
        choices:[
          { label:'推开正前方的金属门（→ Level 3）', goto:'L3:entry', effects:[['stamina',-6]] },
          { label:'退回有霉味的左门（→ Level 1）', goto:'L1:entry', effects:[['sanity',2]] },
          { label:'凑近蓝色闪灯看个究竟', goto:'blue_light' },
        ]},
      blue_light:{ id:'blue_light',
        text:'你把脸贴近门缝。蓝灯的节奏不对——它不是在闪烁，是在"呼吸"，一明一暗间，门后似乎有什么正配合着那节奏轻轻摇晃。生存手册说蓝色闪灯通往别处，但没说门后会不会先有东西在等你。这扇门，你拿不准。',
        choices:[
          { label:'还是别开这扇门，退回三岔口', goto:'bottleneck', effects:[['sanity',-3]] },
          { label:'推开正前方的金属门下行（→ Level 3）', goto:'L3:entry', effects:[['stamina',-6]] },
        ]},
      dark_hall:{ id:'dark_hall',
        text:'你不顾闪烁的灯，径直走进了无灯的黑暗。脚下是没过脚踝的积水，伸手不见五指。机械的嗡鸣消失了，取而代之的是一种密集的、干燥的振翅声——这片黑暗里，有东西在飞。你意识到自己走进了 Death Moth 的巢穴深处。',
        onEnter:[['sanity',-9]],
        choices:[
          { label:'打开手电看清四周', requires:(s)=>!!s.inv.flashlight, goto:'moth_light' },
          { label:'循着记忆原路摸回闪烁的灯', goto:'entry', effects:[['sanity',-5],['stamina',-6]] },
          { label:'继续在黑暗里盲目深入', goto:'corridor_ambush', effects:[['sanity',-4]] },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
