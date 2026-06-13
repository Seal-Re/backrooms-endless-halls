(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.LExcl = {
    id:'LExcl', name:'Level ! 不想死就快跑', class:4, danger:'追逐致死·死区·只能进一次', safe:false,
    entities:['deathmoth','smiler','hound','partygoer','wretch','skinstealer'],
    nodes:{
      entry:{ id:'entry',
        text:'你睁开眼。一间病房，被一层血红的光浸透。中央一张病床，被子叠得整整齐齐，像没人睡过。床头桌上摆着几样东西，墙角是一只药柜。安静。太安静了。\n然后——警报响了。震耳的、不间断的电铃声，从墙里、地里、天花板里同时灌进你的脑子。走廊那头，一排被锁的门开始嘭、嘭、嘭地砸响。它们要出来了。',
        variants:{
          dread:'红光在你眼里发黑。警报声里夹着无数指甲刮门的声音。那些门后面有东西在数你——一、二、三——数到几它们就出来？',
          broken:'红。红。床上躺着的是你自己，叠在被子里，安安静静。警报是你的心跳。门后是你自己在砸门。快跑。可你已经在床上了，怎么跑？快跑。' },
        onEnter:[['sanity',-6]],
        choices:[
          { label:'花五秒翻床头桌和药柜，抓物资就跑', goto:'supply' },
          { label:'什么都别管，立刻冲向走廊', goto:'corridor1', effects:[['sanity',-2]] },
        ]},

      supply:{ id:'supply',
        text:'你扑向床头桌：一瓶杏仁水·灰、一支手电。药柜里翻出一小包火盐。生存指南第一条在脑子里炸开——别贪，多带反而拖慢你。门快被砸穿了。',
        onEnter:[['give','almond_grey',1],['give','flashlight',1],['give','firesalt',1]],
        choices:[
          { label:'够了，抓上就冲进走廊', goto:'corridor1', effects:[['stamina',-3]] },
          { label:'再多翻一会儿，能拿就拿（贪婪）', goto:'greed_death', effects:[['sanity',-4]] },
        ]},

      greed_death:{ id:'greed_death',
        text:'你又拉开一个抽屉、又翻一个柜子。就在你直起腰的瞬间，所有的门同时炸开。走廊里涌出的东西多到看不清形状，它们以一模一样的速度朝病房涌来，把你按回了那张整齐的病床上。',
        choices:[ { label:'……', ending:'sanity_zero' } ]},

      corridor1:{ id:'corridor1',
        text:'你冲进走廊。医院式的长廊向两端无限延伸，头顶随意排布的「EXIT」标志发着暗红的光——这是这里唯一的光源，于是有的地段亮得刺眼，有的地段黑得彻底。脚下的地砖在轻轻震动。\n身后，破门而出的实体群追了上来，速度和你几乎一致。只有一个方向：往前。',
        onEnter:[['sanity',-3],['stamina',-5]],
        choices:[
          { label:'闷头狂奔，不回头', goto:'moths', effects:[['stamina',-6]] },
          { label:'回头看一眼追兵（致命的犹豫）', goto:'hesitate_death', effects:[['sanity',-5]] },
        ]},

      hesitate_death:{ id:'hesitate_death',
        text:'你回头了。就那么半秒。脚下一个踉跄，膝盖砸在裂开的地砖上。等你想爬起来，那一致的脚步声已经漫过了你。它们不急——它们从来不急。',
        choices:[ { label:'……', ending:'collapse' } ]},

      moths:{ id:'moths',
        text:'前方一段开阔的高顶廊厅。天花板上密密麻麻悬着一团黑——死亡飞蛾（Death Moths），它们成群俯冲下来，扑向你的脸和脖子。你想起来：它们不聪明，会被扔出去的东西引开。',
        onEnter:[['sanity',-4]],
        choices:[
          { label:'抄起杏仁水瓶往侧面用力扔，引开它们', requires:(s)=>!!s.inv.almond_grey, goto:'corridor2', effects:[['take','almond_grey',1],['stamina',-4]] },
          { label:'打开手电直照蛾群，想把它们烤退（错套规则）', requires:(s)=>!!s.inv.flashlight, goto:'moth_death' },
          { label:'用胳膊护住头，硬冲过蛾群', goto:'corridor2', effects:[['sanity',-8],['stamina',-10]] },
        ]},

      moth_death:{ id:'moth_death',
        text:'光不是用来对付飞蛾的——那是给笑魇的法子。手电的光柱反而像信标，整团黑潮顺着光涌向你的手、你的眼睛。等你扔掉手电时，已经看不见路了。你撞上一面金属门，停了下来。在这里，停下就是结束。',
        choices:[ { label:'……', ending:'collapse' } ]},

      corridor2:{ id:'corridor2',
        text:'廊厅尽头是一段彻底漆黑的区段——某盏 EXIT 标志熄了。黑暗里传来低沉的、循着声音逼近的喘息：Hound（猎犬）。生存指南说它聪明，而且喜爱光明，可以射击光源让它迷惑。\n你身后追兵的脚步还在，一致地、不紧不慢地踩着。',
        onEnter:[['sanity',-5]],
        choices:[
          { label:'摸黑贴墙快走，绝不开灯', goto:'safezone', effects:[['stamina',-7],['sanity',-3]] },
          { label:'用火盐点燃远处的一盏标志，把猎犬引向那点光', requires:(s)=>!!s.inv.firesalt, goto:'safezone', effects:[['take','firesalt',1],['sanity',4]] },
          { label:'打开手电照清路面再跑（错套规则）', requires:(s)=>!!s.inv.flashlight, goto:'hound_death' },
        ]},

      hound_death:{ id:'hound_death',
        text:'你忘了——猎犬喜爱光明。手电一亮，喘息声便毫不犹豫地朝光奔来。它比飞蛾聪明得多，绕过你的护臂，从黑暗里精准地咬住了那束光的源头：你的手，然后是你。',
        choices:[ { label:'……', ending:'collapse' } ]},

      safezone:{ id:'safezone',
        text:'前方的红光忽然换了色——一道蓝色的门。推开，是一小段蓝色调、光照充足的安全区（Safe Zone）。警报声在这里被隔成了遥远的嗡鸣，没有任何实体。架子上有杏仁水和能量棒，墙边一张床。只有 6% 的人见过这里。\n生存指南第四条：在安全区慢慢来。别只待十分钟就走。',
        onEnter:(s)=> s.flags.found_safezone ? [] : [['give','almond_grey',1],['give','almond_blue',1],['flag','found_safezone',true]],
        choices:[
          { label:'休整（存档点）', goto:'safezone', noTick:true, effects:[['sanity',8]] },
          { label:'喝下杏仁水·蓝，压住要崩的神经', requires:(s)=>!!s.inv.almond_blue, goto:'safezone', effects:[['take','almond_blue',1],['sanity',30]], noTick:true },
          { label:'养足精神，重新踏进红色走廊', goto:'smiler', effects:[['stamina',20],['sanity',6]] },
        ]},

      smiler:{ id:'smiler',
        text:'回到血红的走廊。前方一段越来越暗，黑暗里悬浮着两道弯弯的、发亮的白——一张咧到极致的笑。Smiler（微笑者），这层里最大的威胁。它怕火怕光：手电能挡住它出门，火盐能逼退它；可你要是直视它、又拿不出光，它就会贴上来。',
        onEnter:[['sanity',-7]],
        choices:[
          { label:'举起手电，把光柱死死压在那张笑上', requires:(s)=>!!s.inv.flashlight, goto:'fork', effects:[['sanity',3],['stamina',-4]] },
          { label:'撒一把火盐点燃，用火墙隔开它', requires:(s)=>!!s.inv.firesalt, goto:'fork', effects:[['take','firesalt',1],['sanity',2]] },
          { label:'什么都没有，那就直愣愣盯着它走过去（错套规则）', goto:'smiler_death' },
        ]},

      smiler_death:{ id:'smiler_death',
        text:'没有光，没有火，你却迎着那张笑直直走了过去——这正是它等的。黑暗里那道笑骤然放大，吞掉了所有别的颜色。你最后看清的，是它没有眼睛，只有笑。',
        choices:[ { label:'……', ending:'smiler_eaten' } ]},

      fork:{ id:'fork',
        text:'你跑过一个又一个弯道。每一个弯道都制造出「到达出口」的假象。眼前同时出现两扇门：左边那扇 EXIT 标志暗得几乎看不清，门缝里透着死寂的空气；右边那扇下方，渗出一线清亮、稳定的蓝光。\n生存指南：假出口的标志通常较暗，多通向空房间——进去就再也出不来。',
        onEnter:[['sanity',-4],['stamina',-6]],
        choices:[
          { label:'推开标志暗淡的左门', goto:'fake_exit' },
          { label:'走向渗着稳定蓝光的右门', goto:'bottleneck' },
          { label:'喝口杏仁水·灰续命再决定', requires:(s)=>!!s.inv.almond_grey, goto:'fork', effects:[['take','almond_grey',1],['thirst',-50],['stamina',30],['sanity',10]], noTick:true },
        ]},

      fake_exit:{ id:'fake_exit',
        text:'门在身后合上。这是一个空房间——四壁是不可摧毁的金属，没有第二扇门。标志的暗，本就是警告。墙外，那一致的脚步声慢慢围拢过来，不慌不忙地等你力竭。这里没有出口，从来没有。',
        choices:[
          { label:'砸门、嘶吼，直到再也跑不动', ending:'collapse' },
        ]},

      bottleneck:{ id:'bottleneck',
        text:'蓝光越来越亮。这一段走廊两侧再没有岔路、没有弯道——生存指南说过：若尽头的门两侧没有别的岔路，那才是真出口。你跑过最后一公里，腿已经不属于你，但那道蓝门近在咫尺。\n突然，头顶一盏 EXIT 标志开始异常闪烁，发出刺耳的嘶嘶声，亮度诡异地飙升——它要爆炸了，会在你和门之间烧起一道火墙。',
        onEnter:[['sanity',-5],['stamina',-8]],
        choices:[
          { label:'赌一把，在标志炸开前抢冲过去', goto:'exit_door', effects:[['stamina',-12],['sanity',-4]] },
          { label:'用火盐先在脚下引一道反向火，逼自己只剩冲刺一条路', requires:(s)=>!!s.inv.firesalt, goto:'exit_door', effects:[['take','firesalt',1],['stamina',-6],['sanity',3]] },
          { label:'怕烧，停下来等火势过去（致命的停顿）', goto:'stop_death' },
        ]},

      stop_death:{ id:'stop_death',
        text:'你停了。生存指南第二条你忘得一干二净——绝不能停下。火墙烧着烧着，身后那不紧不慢的脚步声却追了上来。它们不怕等。在 Level ! 里，停下从来不是休息，是把命交出去。',
        choices:[ { label:'……', ending:'collapse' } ]},

      exit_door:{ id:'exit_door',
        text:'火舌擦着你的后背炸开。你用尽最后一点力气撞上那道蓝门——它开了。门外不是另一条红色走廊，是一片温暖的、安静的虚无，警报声被彻底关在了身后。你逃出来了。约十公里，只能进一次的 Level !，被你跑完了。\n身后的门缓缓合上，再不会为你打开。可你手里，多出了一样原本不该有的东西：一把通往终焉的钥匙。',
        onEnter:[['sanity',12],['flag','end_key',true]],
        choices:[
          { label:'攥紧钥匙，走进那片虚无（→ The End）', goto:'TheEnd:entry', effects:[['sanity',5]] },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
