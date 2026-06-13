(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.TheEnd = {
    id:'TheEnd', name:'The End 终焉', class:0, danger:'阈限 / 心灵陷阱 / 唯我论', safe:false,
    entities:['partygoer','smiler'],
    nodes:{
      entry:{ id:'entry',
        text:'门框在你身后消失了——连同那道你穿过来的扭曲。你站在一座图书馆里。书架一排排延伸到看不见的地方，大多空着。荧光灯偶尔闪一下。最先压上来的不是恐惧，是寂静：安静得能听见自己耳膜里的血流。墙上钉着零散的金属字，远处的那串拼出「the end is near」。',
        variants:{
          calm:'你站在一座几乎无尽的空图书馆里。空气陈旧，灯光偶尔闪烁，寂静得近乎完美。墙上的金属字拼着「the end is near」。',
          dread:'寂静里夹着别的东西。书架的尽头像在呼吸地缓缓挪移，那串金属字——你确定刚才不是这么排的。「the end is near」。near。near。它在靠近什么？',
          broken:'你到家了。是的，这就是家。书的味道，安静，没有黄色，没有嗡鸣。你可以放下了。你终于可以放下了。……门？什么门？这里从来就没有门。你一直都在这座图书馆里读书，不是吗。'
        },
        onEnter:[['sanity',-2]],
        choices:[
          { label:'摸出口袋里那把刻着「Level !」的钥匙，去找它对应的门', requires:(s)=>!!s.flags.end_key, goto:'true_door' },
          { label:'在书架间走下去，看看这里到底是什么', goto:'stacks' },
          { label:'坐到最近的阅览台前，先缓一缓', goto:'alcove' },
        ]},

      true_door:{ id:'true_door',
        text:'钥匙在掌心发烫。你沿着书架走，金属字的「near」在余光里一个个熄灭。转过最后一排，一扇普通到突兀的木门嵌在墙上——门把上有个细小的锁孔，形状恰好是「Level !」那把钥匙的齿。这是它存在的意义。',
        variants:{
          dread:'门就在那儿。可你的手不想动。门后会不会也只是另一座图书馆？另一场「假现实」？只有一个办法知道。',
        },
        choices:[
          { label:'插入钥匙，转动，推门', requires:(s)=>!!s.flags.end_key, effects:[['flag','used_end_key',true]], ending:'escape' },
          { label:'……再想想，先别开（回到书架）', goto:'stacks' },
        ]},

      stacks:{ id:'stacks',
        text:'你在书架的迷宫里走。书几乎都不在；偶尔抽出一本，里面全是空白，或者反复印着「The End」三个字。几何在背后悄悄变形——你回头，来路已经不是来路了。一张长桌上摆着几台老式电脑，崭新得不像属于这里。',
        onEnter:[['sanity',-4],['stamina',-4]],
        choices:[
          { label:'去试试那些电脑', goto:'terminal' },
          { label:'继续往里走，追那串金属字', goto:'letters' },
          { label:'退回阅览台歇会儿', goto:'alcove' },
          { label:'喝一口杏仁水·蓝，压一压翻涌的念头', requires:(s)=>!!s.inv.almond_blue, goto:'stacks', effects:[['take','almond_blue',1],['sanity',30]], noTick:true },
        ]},

      terminal:{ id:'terminal',
        text:'你按下电源。机器发出轻微的嗡鸣——在这种寂静里，像一声尖叫。屏幕亮起，白字打出本层的名字：THE END。几秒后，画面塌成渐隐的雪花噪点。你再按，它不再亮了。但有一台还醒着，屏幕上滚动着一行字：「想回家吗？跟着声音走。」',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'循着那台电脑指的方向走', goto:'fake_reality' },
          { label:'不理它，回书架', goto:'stacks' },
          { label:'拔掉电源，让它彻底安静', goto:'silence', effects:[['sanity',4]] },
        ]},

      fake_reality:{ id:'fake_reality',
        text:'转过一排书架，光变暖了。前方是一间亮着灯的客厅：电视在放老节目，茶几上有热气腾腾的饭，几个人在沙发上说笑，回头朝你招手——「回来啦，等你好久了。」每一个细节都对。太对了。这是「假现实」，是这层用来留住你的诱饵。屋角的彩带和纸帽在轻轻晃动。',
        variants:{
          dread:'他们的脸你都认识。可你越看，越想不起自己叫什么——好像只要走进去坐下，就再也不必想起了。',
          broken:'家。这就是家。坐下吧。吃口饭吧。外面没有后室，从来没有过。坐下吧。',
        },
        onEnter:[['sanity',-6]],
        choices:[
          { label:'走进去，坐下，享受这一切', goto:'partygoer_trap' },
          { label:'盯着彩带和纸帽——派对客（Partygoer）。绝不加入。转身就走', goto:'silence', effects:[['sanity',-4]] },
          { label:'用镜子照向那几张「熟悉的脸」', requires:(s)=>!!s.inv.mirror, goto:'reveal_fake', effects:[['flag','mirror_used',true]] },
        ]},

      reveal_fake:{ id:'reveal_fake',
        text:'镜子里，客厅是空的——没有电视，没有饭，没有人。只有彩带垂在黑暗里，和几具背对着你、一动不动站着的派对客（Partygoer）。它们「永恒狂欢」的规则你记得：绝不加入，绝不进食其食物。你慢慢退出这片暖光。',
        onEnter:[['sanity',-5]],
        choices:[
          { label:'退回寂静的书架深处', goto:'silence', effects:[['sanity',6]] },
        ]},

      partygoer_trap:{ id:'partygoer_trap',
        text:'你坐进沙发，有人把一盘食物推到你面前。「吃啊。」你拿起来——食物入口的瞬间，墙、电视、人脸全部融化成黑色的彩带。派对客（Partygoer）的笑容凑近。你想站起来，却分不清哪边是门、哪句低语是自己的念头。外面？外面是什么。从来就没有外面。',
        choices:[
          { label:'……（沉入「家」里）', ending:'sanity_zero' },
        ]},

      letters:{ id:'letters',
        text:'你顺着墙上的金属字走。「the end is near」反复出现，每一次都离得更近，字也更大。终于，一整面墙被字铺满，挤成一片无意义的金属噪声。墙根的暗处，有什么东西。一道弧线在黑里亮起来——一张悬空的、发光的笑脸。Smiler（微笑者）。',
        onEnter:[['sanity',-7]],
        choices:[
          { label:'按规则：不可直视，垂下眼睛慢慢退开', goto:'silence', effects:[['sanity',2]] },
          { label:'点燃火盐，逼它退后，再退走', requires:(s)=>!!s.inv.firesalt, goto:'silence', effects:[['take','firesalt',1],['flag','firesalt_ready',true],['sanity',-3]] },
          { label:'直视那道笑，想看清它到底是什么（错误）', goto:'smiler_death' },
        ]},

      smiler_death:{ id:'smiler_death',
        text:'你迎上那道弧线。寂静里，笑容无声地拉宽、拉近，填满你的整个视野——0 分贝里，最后连你自己的心跳都听不见了。',
        choices:[
          { label:'……', ending:'smiler_eaten' },
        ]},

      silence:{ id:'silence',
        text:'你走进图书馆最深、最静的区域。声压低到近乎 -6 分贝，安静得像把人按进棉花。寂静本身开始制造幻觉：耳边有翻书声，有人轻声念你的名字，可身边一个人都没有。但这里也最适合分辨「真」与「假」——头脑反而清醒了一点。墙基有一道轻微抖动的纹理，像没渲染完。',
        variants:{
          dread:'念你名字的声音越来越多，从四面八方涌来。它们在劝你坐下，劝你留下，劝你别再找那扇门了。',
        },
        onEnter:[['sanity',-3]],
        choices:[
          { label:'回阅览台，整理一下自己', goto:'alcove' },
          { label:'回书架，继续找出口', goto:'stacks' },
          { label:'抓住扭曲的窗口，从抖动的墙撞穿出去', goto:'distortion' },
        ]},

      alcove:{ id:'alcove',
        text:'你回到一处三面书架围合的阅览台，把椅子搬来抵住缺口。这里灯还算稳，寂静也不那么咄咄逼人。你坐下，让翻涌的念头慢慢沉底。只要还记得自己为什么要找那扇门，你就还没真的留在这儿。',
        choices:[
          { label:'休整（存档点）', goto:'alcove', noTick:true, effects:[['sanity',8]] },
          { label:'抄起桌上半瓶没喝完的杏仁水·灰', requires:(s)=>!s.flags.took_alcove_water, goto:'alcove', effects:[['give','almond_grey',1],['flag','took_alcove_water',true]], noTick:true },
          { label:'起身，回到书架间', goto:'stacks' },
          { label:'去最深的寂静区找扭曲出口', goto:'silence' },
        ]},

      distortion:{ id:'distortion',
        text:'墙的纹理抖得越来越厉害——「扭曲（Distortion）」正在发生，这是这座图书馆少数能离开的窗口。你后退几步，对准那片没渲染完的墙，能量在指尖嗡嗡发麻。撞过去，下一刻你就会落进它呈现的某个场景。',
        variants:{
          dread:'但你心里清楚：从这里出去，只是回到后室的某一层。真正的尽头、真正的门，需要那把你（也许）没有的钥匙。',
        },
        choices:[
          { label:'对着钥匙的方向再确认一次——你带着「Level !」的钥匙吗？', requires:(s)=>!!s.flags.end_key, goto:'entry' },
          { label:'没有钥匙……那就承认吧：这里就是尽头。停下来，不再找了', requires:(s)=>!s.flags.end_key, ending:'reach_end' },
          { label:'退回去，先不撞', goto:'silence' },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
