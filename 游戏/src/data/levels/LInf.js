(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.LInf = {
    id:'LInf', name:'Level ∞ 无限层级', class:4, danger:'实体侵染 · 模因循环 · 永无逃脱', safe:false,
    entities:['facelings','smiler','partygoer','deathmoth'],
    nodes:{
      entry:{ id:'entry',
        text:'你站在一座机场航站楼里。出发牌在头顶轻轻翻页，登机口的座椅排成整齐的行列，免税店的灯还亮着。一切都很正常——直到你读出最近的航班信息牌：目的地一栏，每一行都写着同一个字，「∞」。广播响起一段温吞的提示音，然后是寂静。你回头看来时的廊桥，它已经接上了另一段一模一样的航站楼。',
        variants:{
          dread:'航站楼太干净了，干净得不像有人来过。窗外是一片均匀的白，什么都没有。广播又响了——这次，提示音里夹着你母亲的声音，在很远的登机口喊你的名字。你没有母亲在这里。你确定吗？',
          broken:'你一直在登机。一直在登机。出发牌翻着，翻着，每一行都是∞，每一行都是你。地毯记得你的脚步，比你自己记得清楚。跟随声音，跟随光，接受你唯一的命运。你来过这里几次了？数字也开始撒谎。',
        },
        onEnter:[['sanity',-4]],
        choices:[
          { label:'沿着登机口的指示牌往前走', goto:'concourse', effects:[['stamina',-4]] },
          { label:'走进还亮着灯的免税店找补给', goto:'shop' },
          { label:'走近落地窗，看看外面是什么', goto:'window' },
        ]},

      concourse:{ id:'concourse',
        text:'你沿着一长排登机口往前走。A12、A13、A14……号码一直涨，座椅一直延伸，没有尽头。走了很久，你回头，A12 又出现在你前方。你意识到这条廊道在循环——但每绕一圈，总有什么细微地变了：上一圈那盏闪烁的灯，这一圈不闪了；上一圈空着的座椅，这一圈坐着一个背对你的人形。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'继续往前走，记住每一圈的不同（绕圈）', goto:'loop', effects:[['stamina',-3]] },
          { label:'退回主厅', goto:'entry' },
          { label:'走向那个背对你的人形', goto:'faceling' },
        ]},

      loop:{ id:'loop',
        text:'你又绕回了 A12。这是第几圈了？你强迫自己数着差异：地毯花纹偏移了一指宽，出发牌上多了一班永不起飞的航班，远处餐厅的冷柜门开了一道缝。循环在漂移。多绕几圈，也许能从漂移里读出规律——也许只会读出疯狂。',
        variants:{
          dread:'又是 A12。差异越来越难分辨，或者说，是你越来越分不清。你怀疑自己根本没在动，是航站楼在你脚下偷偷换牌。',
          broken:'A12。A12。A12。没有第几圈，只有这一圈，永远的这一圈。墙在呼吸，出发牌在数你。你一直都在这儿，不是吗。',
        },
        onEnter:[['sanity',-5],['thirst',4]],
        choices:[
          { label:'再绕一圈，继续记录漂移', goto:'loop', effects:[['stamina',-3],['thirst',3]] },
          { label:'拼出规律：找到那扇「会渲染错」的登机口（需绕够圈数）', requires:(s)=>(s.visited['LInf:loop']||0)>=3, goto:'true_gate' },
          { label:'放弃挣扎，跟随广播里的声音走（需绕够圈数）', requires:(s)=>(s.visited['LInf:loop']||0)>=5, goto:'surrender' },
          { label:'离开循环，去免税店补给', goto:'shop' },
        ]},

      shop:{ id:'shop',
        text:'免税店的货架满满当当：成排的瓶装水、包装精美的食物、手电筒、打火机。你太渴了，伸手就要拿一瓶水——可这里没有杏仁水，连一瓶都没有。所有「水」的标签上，配料表是一行你看不懂的卢恩文。货架上的食物散发着甜腻又陌生的气味。',
        onEnter:[['sanity',-2]],
        choices:[
          { label:'只拿手电筒和打火机，不碰食物饮料', goto:'concourse', effects:[['give','flashlight',1],['give','battery',1]] },
          { label:'拧开一瓶「水」灌下去（太渴了）', goto:'tainted' },
          { label:'什么都不拿，退出去', goto:'entry' },
        ]},

      tainted:{ id:'tainted',
        text:'水入口是甜的，甜得发腻。三秒后你的喉咙开始烧。这层找不到杏仁水是有原因的——货架上的一切都不能碰。你扶着货架干呕，视线扭曲，卢恩文从标签上爬下来，钻进你的眼睛。',
        onEnter:[['sanity',-12],['thirst',-10],['stamina',-15]],
        choices:[
          { label:'撑着站起来，逃回主厅', goto:'entry', effects:[['sanity',-4]] },
        ]},

      window:{ id:'window',
        text:'你走近落地窗。外面是一片纯粹的、没有深度的白，看久了眼睛发酸。现在还是白天。你想起设定里那句警告：到了夜里，窗户会变成紫罗兰色，自己向外打开——而进去的人，再没有列在任何名单上。此刻天色正在暗下去。',
        choices:[
          { label:'趁还是白天，立刻离开窗边', goto:'entry', effects:[['sanity',-3]] },
          { label:'等到夜里，看看打开的窗后面是什么', goto:'violet_window' },
        ]},

      violet_window:{ id:'violet_window',
        text:'天黑了。整排窗户同时泛起紫罗兰色的光，无声地向外打开，像一排张开的嘴。冷风涌进来，广播里的声音变得清晰：跟随光，成为我们的一部分。窗外那片白里，开始浮现无数张你认识的脸，朝你伸手。同时，黑暗的航站楼里，每一个登机口都站起了实体。',
        onEnter:[['sanity',-10]],
        choices:[
          { label:'踏进打开的紫窗（未知传送）', goto:'window_drop' },
          { label:'转身狂奔回内厅深处', goto:'night' },
        ]},

      window_drop:{ id:'window_drop',
        text:'你跨过窗框。脚下没有地面，那片白接住了你，又松开了你。坠落没有方向，那些认识的脸贴上来，喊着你的名字，温柔地把你拆开。你在别处醒来——如果那还算醒来。',
        choices:[
          { label:'……', goto:'L0:entry' },
        ]},

      faceling:{ id:'faceling',
        text:'你绕到那个背对你的人形面前。它穿着体面的旅客衣装，安静地坐着。它缓缓转过头——脸是一整片平滑的空白，没有眼睛、没有嘴。Faceling（无面者）。它们通常温和，但本能地厌恶被直视太久。它歪了歪头，等着你的反应。',
        onEnter:[['sanity',-5]],
        choices:[
          { label:'低头、不与它对视，安静绕开', goto:'concourse', effects:[['sanity',3]] },
          { label:'盯着它那张空白的脸看个仔细（错误）', goto:'faceling_death' },
          { label:'用手电直照它的脸（错误）', requires:(s)=>!!s.inv.flashlight, goto:'faceling_death' },
        ]},

      faceling_death:{ id:'faceling_death',
        text:'你直视它。空白的脸上，慢慢裂开一道弧线——一个不属于无面者的、过宽的笑。它不再是 Faceling 了。Smiler（微笑者）从被你激怒的它身体里浮上来，整座航站楼的灯应声熄灭。你套错了规则：在这里，直视，是邀请。',
        choices:[
          { label:'……', ending:'smiler_eaten' },
        ]},

      night:{ id:'night',
        text:'你逃进内厅深处，背靠一根水泥柱。夜晚的航站楼里满是脚步声——后室几乎所有实体都在夜循环中苏醒。远处传来派对的鼓点和扭曲的笑声（Partygoer），头顶掠过死亡飞蛾（Deathmoth）拍翅的闷响。你需要熬到天亮，或者找到真正的出口。',
        variants:{
          broken:'脚步，笑声，拍翅。你分不清哪些是实体，哪些是你自己。也许你也是它们中的一个了。也许你一直都是。',
        },
        onEnter:[['sanity',-8]],
        choices:[
          { label:'屏息蜷在柱后，熬到天亮', goto:'concourse', effects:[['sanity',-6],['stamina',-8],['thirst',6]] },
          { label:'循着没有实体的方向，去找登机口', goto:'loop' },
        ]},

      true_gate:{ id:'true_gate',
        text:'绕了一圈又一圈，你终于把漂移拼成了规律：每一圈，有一个登机口的号码会比应有的少一位——那不是循环的一部分，那是循环的「缝」。你找到它：一个号码在轻微抖动、像没渲染完的登机口。牌子上写着 GATE ∞，廊桥尽头不是飞机，是一片温暖的、不刺眼的光。这不是「登机逃生」的陷阱航班，这是循环本身的裂缝。',
        onEnter:[['sanity',5]],
        choices:[
          { label:'走进 GATE ∞，跟随那片光（→ The End）', goto:'TheEnd:entry', effects:[['sanity',6]] },
          { label:'不信任它，退回去再绕一圈确认', goto:'loop', effects:[['sanity',-4]] },
          { label:'登上停在缝里的那架飞机（看着像真航班）', goto:'boarding' },
        ]},

      boarding:{ id:'boarding',
        text:'你没走那片光，而是踏上廊桥尽头的飞机。舱门内，一个被白光彻底抹去的人形迎上来，向你索要护照。你想起规则：必须如实回答它的每一个问题，登机后绝不与任何人形对视，落地时务必最后一个下机。它开口问你：「你为什么想离开？」',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'如实回答，全程低头不与人形对视', requires:(s)=>s.sanity>=15, goto:'flight_ok' },
          { label:'撒个谎，敷衍它（错误）', goto:'flight_bad' },
          { label:'落座后忍不住抬头看了别的乘客一眼（错误）', goto:'flight_bad' },
        ]},

      flight_ok:{ id:'flight_ok',
        text:'你诚实作答，全程垂着眼。航班无声起飞，飞了不知多久。落地时，你按规则等到最后一个走下舷梯。舱门外不是机场，是一条熟悉的、下着雨的街道——前室。你做对了每一步。墙后的嗡鸣，从此只在梦里。',
        choices:[
          { label:'走下舷梯，回家', ending:'escape' },
        ]},

      flight_bad:{ id:'flight_bad',
        text:'你违反了规则——也许是撒了谎，也许是对视了。人形没有发怒，只是安静地记下了。飞机落地，舱门打开，外面是又一座一模一样的航站楼，出发牌上每一行还是∞。你被原样送了回来，记忆却少了一块。又一次推开同一扇门，第几次了？',
        onEnter:[['sanity',-10]],
        choices:[
          { label:'数不清第几次地，再走回那条循环廊道', requires:(s)=>(s.visited['LInf:loop']||0)<8, goto:'loop' },
          { label:'彻底分不清自己绕了多少圈（迷失过深）', requires:(s)=>(s.visited['LInf:loop']||0)>=8, ending:'red_loop' },
        ]},

      surrender:{ id:'surrender',
        text:'你停下了数圈。广播里的声音从未如此清晰、如此温柔：没有真正的终结，没有逃脱，只有无尽。无限才是这个现实的真实形态。跟随声音，跟随光，接受你唯一的命运，成为我们的一部分。你松开了所有抵抗。第几次了？数字也开始撒谎，然后连撒谎都停了。',
        choices:[
          { label:'接受，成为循环的一部分', ending:'red_loop' },
          { label:'最后一次咬牙挣脱，回到廊道', goto:'loop', effects:[['sanity',-8]] },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
