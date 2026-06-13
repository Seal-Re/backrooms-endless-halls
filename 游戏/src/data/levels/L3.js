(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.L3 = {
    id:'L3', name:'Level 3 发电站', class:2, danger:'毒气·自燃·实体密集', safe:false,
    entities:['facelings'],
    nodes:{
      entry:{ id:'entry',
        text:'积水管道把你吐进一条狭窄的工业走廊。棕色砖墙覆满灰尘，铜管沿天花板蜿蜒，某处机械在稳定地、永不停歇地运转。空气是热的，66 度往上，越往里越闷。然后你注意到手机——信号满格。在后室满格。',
        variants:{
          dread:'……热。铜管在低处嗡嗡作响，像有什么在管子里游动。信号满格——可这地方连一个活人都没有，谁在那头？',
          broken:'管子在数你的心跳。每一根都通向你。满格，满格，满格——它们都在拨你的号。别接。别接。别接。' },
        onEnter:[['sanity',-3]],
        choices:[
          { label:'蹭这后室最强的 Wi-Fi，下载 M.E.G. 数据库', goto:'wifi' },
          { label:'沿运转的机械声往里走', goto:'corridor', effects:[['stamina',-5]] },
          { label:'贴墙慢行，避开头顶的管道', goto:'corridor', effects:[['stamina',-8],['sanity',2]] },
        ]},
      wifi:{ id:'wifi',
        text:'你连上信号，M.E.G. 的层级图谱一条条灌进来。屏幕亮着的几分钟里，你第一次觉得不那么孤单。数据库标注：本层有武装基地 Gamma，向"运转声最响处"走可寻获补给；另警告——黑色管道液体剧毒，蒸气致命。',
        onEnter:(s)=> s.flags.read_meg_db ? [] : [['flag','read_meg_db',true],['sanity',6]],
        choices:[
          { label:'记下警告，去找 Gamma 基地', goto:'corridor', effects:[['stamina',-5]] },
          { label:'多留一会儿，给手电充上电', requires:(s)=>!!s.inv.flashlight && !s.flags.charged_l3, goto:'wifi', effects:[['give','battery',1],['flag','charged_l3',true],['sanity',2]], noTick:true },
        ]},
      corridor:{ id:'corridor',
        text:'走廊在前方分岔，每条都一模一样地黑、一样地热。一条尽头有机械的火花在明灭；一条地面爬着一道黑色的、缓缓流淌的黏液，从破裂的管道渗出，散着刺鼻的甜腥。第三条窄得要侧身，深处隐约有人形静静站着，背对着你。',
        onEnter:[['sanity',-4],['thirst',8]],
        choices:[
          { label:'走向火花明灭的机械区', goto:'machine' },
          { label:'查看渗出黑液的破管', goto:'slime' },
          { label:'侧身挤进窄道，靠近那个人形', goto:'faceling' },
          { label:'退回去，找个能据守的死角', goto:'safehouse' },
        ]},
      slime:{ id:'slime',
        text:'黑液在地上铺开，表面浮着一层油亮的膜，热气把甜腥的蒸气往上送。数据库说过这东西——神经毒，蒸气致命。但管道接口处卡着一个旧背包，半泡在黏液边缘。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'屏息，用衣物裹手快速拽出背包', goto:'slime_loot', effects:[['stamina',-6],['sanity',-4]] },
          { label:'不值得，原路退回岔口', goto:'corridor', effects:[['sanity',2]] },
          { label:'凑近闻一下确认是不是真的有毒', goto:'slime_death' },
        ]},
      slime_loot:{ id:'slime_loot',
        text:'你裹着衣袖、憋着一口气，把背包猛地拽上岸，立刻后退几步大口换气。背包里有一瓶杏仁水·灰，还有一小袋火盐——在这满是自燃机械的地方，火盐意外地让人安心。',
        onEnter:[['give','almond_grey',1],['give','firesalt',1]],
        choices:[
          { label:'带着补给退回岔口', goto:'corridor', effects:[['sanity',4]] },
        ]},
      slime_death:{ id:'slime_death',
        text:'你弯下腰。只闻了半口——喉咙像被人灌进了滚烫的钉子。视野从边缘开始烧黑，腿先于你做出了决定，跪进了那摊黑里。满格的信号还亮着，没人会收到你的最后一条消息。',
        choices:[
          { label:'……', ending:'collapse' },
        ]},
      machine:{ id:'machine',
        text:'机械区轰鸣震耳，一台老旧的配电箱不停喷出火花，墙上的金属被烤得发烫，局部热得能闻到自己头发焦的味道。火花后面的工作台上躺着一支手电筒和几节电池——但你得从喷火花的箱子边上够过去。',
        onEnter:[['sanity',-3],['stamina',-6]],
        choices:[
          { label:'抓一把火盐压住火花，再去取', requires:(s)=>!!s.inv.firesalt, goto:'machine_loot', effects:[['take','firesalt',1]] },
          { label:'看准火花间隙，快速探手去够', goto:'machine_loot', effects:[['sanity',-5],['stamina',-5]] },
          { label:'太危险，退回岔口', goto:'corridor' },
        ]},
      machine_loot:{ id:'machine_loot',
        text:'你够到了工作台。手电筒还能亮，电池也是满的。在这种地方，光意味着活路——也意味着，你将被看见。',
        onEnter:[['give','flashlight',1],['give','battery',1],['sanity',3]],
        choices:[
          { label:'收好装备，退回岔口', goto:'corridor' },
          { label:'用新手电照向窄道里那个人形', requires:(s)=>!!s.inv.flashlight, goto:'faceling_light' },
        ]},
      safehouse:{ id:'safehouse',
        text:'你退到一处被监狱式铁栏半封住的凹间，铁栏在一侧留了缺口，恰好能进出。三面是厚砖墙，听不见黏液的甜腥，机械声也被隔成了远处的白噪。Gamma 基地的一个游荡哨兵——一名 M.E.G. 探员——窝在角落，朝你点了点头，把半边地方让给你。',
        onEnter:(s)=> s.flags.found_safehouse_l3 ? [] : [['flag','found_safehouse_l3',true],['trust',1]],
        choices:[
          { label:'休整（存档点）', goto:'safehouse', noTick:true, effects:[['sanity',8]] },
          { label:'向探员讨一瓶水', requires:(s)=>!s.flags.got_meg_water_l3, goto:'safehouse', effects:[['give','almond_grey',1],['flag','got_meg_water_l3',true],['trust',1]], noTick:true },
          { label:'问探员深层的去路', goto:'bottleneck' },
          { label:'回到岔口继续探索', goto:'corridor' },
        ]},
      faceling:{ id:'faceling',
        text:'窄道尽头，一个人形背对着你站着，纹丝不动。它有人的轮廓、人的衣服，可当它缓缓转过头——脸上什么都没有，只有一片平滑的、被荧光灯照得发亮的空白。Faceling（无面灵）。它们多半温和，只要你别表现出敌意，别盯着那张"脸"看太久。',
        onEnter:[['sanity',-6]],
        choices:[
          { label:'垂下视线，缓慢侧身从它身边绕过', goto:'faceling_pass' },
          { label:'举起手电直照它的"脸"，看清它', requires:(s)=>!!s.inv.flashlight, goto:'faceling_light' },
          { label:'大喊一声吓退它', goto:'faceling_death' },
        ]},
      faceling_pass:{ id:'faceling_pass',
        text:'你低着头，一步一步,贴着另一侧的砖墙挪过去。那片空白始终对着你转，却没有靠近。挤过窄道后，前方豁然是一条更深的主管道——通向本层的尽头。',
        onEnter:[['sanity',3]],
        choices:[
          { label:'松一口气，走向深处的主管道', goto:'bottleneck' },
          { label:'退回岔口', goto:'corridor' },
        ]},
      faceling_light:{ id:'faceling_light',
        text:'光柱打在那片空白上。一瞬间，无数道人形从黑暗的窄道深处亮了出来——它们全都没有脸，全都把没有眼睛的"脸"转向了你刺眼的光。Faceling 不喜欢被强光直视。它们开始一起，朝光走来。',
        onEnter:[['sanity',-10]],
        choices:[
          { label:'立刻关灯，垂下视线，缓慢后退', goto:'faceling_pass', effects:[['sanity',-4],['stamina',-4]] },
          { label:'举着灯转身狂奔', goto:'faceling_death' },
        ]},
      faceling_death:{ id:'faceling_death',
        text:'你违背了唯一的规矩——你让它们觉得你是威胁。那些没有脸的人形不紧不慢地围拢过来，安静得可怕。最后你看见的，是无数张空白的脸俯下来，凑近你，仿佛终于找到了一张可以借用的脸。',
        choices:[
          { label:'……', ending:'replaced' },
        ]},
      bottleneck:{ id:'bottleneck',
        text:'主管道的尽头是一间巨大的发电室，机械的轰鸣在这里达到顶点。墙上两处异常并排存在：一侧，所有灯具都坏死了，那片绝对的黑暗深得不像影子，冷气从里面渗出，像一扇通往"熄灯"层的门；另一侧，墙上裂开一道荧光闪烁的缝，缝里没有走廊，只有一片刺眼的、不该存在的纯白——那是 Level !（感叹号层）的入口。无论哪条，都不会再回头。',
        onEnter:[['sanity',-5]],
        choices:[
          { label:'回安全屋再喘口气', goto:'safehouse' },
          { label:'踏入那片绝对的黑暗（→ 熄灯）', goto:'L6:entry', effects:[['stamina',-8],['sanity',-3]] },
          { label:'钻进荧光的白缝（→ Level !）', goto:'LExcl:entry', effects:[['stamina',-8],['sanity',-3]] },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
