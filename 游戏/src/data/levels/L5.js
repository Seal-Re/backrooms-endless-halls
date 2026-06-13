(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.L5 = {
    id:'L5', name:'Level 5 恐怖旅馆', class:2, danger:'美丽与恐怖并存', safe:false,
    entities:['skinstealer','smiler'],
    nodes:{
      entry:{ id:'entry',
        text:'你推开一扇旋转门，黄色走廊在身后合拢。脚下是厚实的红地毯，金色壁纸在水晶吊灯下泛光，某处老唱片机正放着 1920 年代的爵士乐。空气干净得反常——你裤脚的污泥正在地毯上自行褪去。前台无人，铜铃静静躺着。一切优雅，一切体面，体面得像一张盖在尸体上的桌布。',
        variants:{
          dread:'爵士乐里好像多了一个声部——很轻的、贴着你耳朵的哼唱。金壁纸上的花纹，刚才是不是有一张脸顺着你转过去了？污泥褪得太快了，快得像这地方急着抹掉你来过的痕迹。',
          broken:'墙纸上全是脸。它们排着队看你，礼貌地、含笑地。唱片机在你脑子里放，你分不清哪段旋律是真的。前台的铃自己响了一声——叮。它在登记你。它早就给你留好了房间。' },
        onEnter:[['sanity',-2]],
        choices:[
          { label:'穿过主厅，往灯火通明处走', goto:'main_hall' },
          { label:'按响前台的铜铃', goto:'front_desk' },
        ]},

      front_desk:{ id:'front_desk',
        text:'你按下铜铃。叮。爵士乐没停，但旅馆像是听见了。一名穿着熨帖制服的侍者从后厅滑出来，笑容标准得像印上去的。"欢迎光临，"他说，"住一晚？还是……找出口？"他的影子投在地毯上，方向和吊灯的光对不上。',
        choices:[
          { label:'问哪里有补给和安全的房间', goto:'homely', effects:[['trust',1]] },
          { label:'直接问出口在哪', goto:'main_hall', effects:[['sanity',-3]] },
          { label:'退开，不和他多说', goto:'main_hall' },
        ]},

      main_hall:{ id:'main_hall',
        text:'主厅向四面无限延伸：一排排房门、错落的地板材质、缓缓升降的电梯，没有一台停在你这层。一块手写木牌斜插在迎宾台上——"家常酒店 Homely Hotel，沿红毯左转"。右侧一道狭长楼梯往下，飘出湿热的蒸汽与机油味（锅炉房）。正前方的舞厅大门虚掩，里面传出几百个人低声交谈的派对声——可门缝里黑着，没有一盏灯。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'去家常酒店落脚', goto:'homely' },
          { label:'循蒸汽下到锅炉房', goto:'boiler' },
          { label:'推开舞厅大门', goto:'ballroom' },
          { label:'喝一口杏仁水·灰', requires:(s)=>!!s.inv.almond_grey, goto:'main_hall', noTick:true, effects:[['take','almond_grey',1],['thirst',-50],['sanity',15],['stamina',30]] },
        ]},

      homely:{ id:'homely',
        text:'红毯尽头是一间挂着暖黄灯串的酒馆——家常酒店。流浪者们围着壁炉分食罐头，墙上钉着层级地图。一个老向导给你倒了杯从墙内管道接来的杏仁水。"新来的，"她说，"两条活路：往回坠回那片黄走廊，或者从锅炉房深处熄了灯出去。但先记住一件事——这里有东西穿着人皮走动。验过再信。"她往你手里塞了样东西。',
        variants:{
          dread:'壁炉的火是暖的，可你总觉得围坐的人里，有一个的笑容比别人慢半拍才挂上去。',
          broken:'他们的脸在火光里融成一片。"验过再信，"老向导说——可你已经不记得怎么验了，也不记得自己是不是人。' },
        onEnter:(s)=> s.flags.met_homely ? [] : [['give','mirror',1],['give','almond_grey',1],['flag','met_homely',true],['trust',1]],
        choices:[
          { label:'休整（存档点）', goto:'homely', noTick:true, effects:[['sanity',8]] },
          { label:'去舞厅碰运气找低概率出口', goto:'ballroom' },
          { label:'下锅炉房，走熄灯出口', goto:'boiler' },
          { label:'循老唱片机的声音去贝弗莉室', goto:'beverly' },
        ]},

      beverly:{ id:'beverly',
        text:'你推开门，进入"永恒的舞厅"——贝弗莉室。数百扇门嵌满四壁，一桌未下完的麻将摆在中央，牌面温热，像刚有人离席。一个背对你的身影正在整理牌局，听见脚步，欢快地回头："哎呀，搭子来啦！坐、坐，正缺一个人。"他热情得无可挑剔，朝你伸出手——指甲缝里嵌着一圈干涸的、不属于自己的暗红。',
        onEnter:[['sanity',-4]],
        choices:[
          { label:'用镜子照他', requires:(s)=>!!s.inv.mirror, goto:'reveal_skinstealer', effects:[['flag','mirror_used',true]] },
          { label:'递给他一瓶杏仁水·红', requires:(s)=>!!s.inv.almond_red, goto:'reveal_skinstealer', effects:[['take','almond_red',1]] },
          { label:'他这么热情，握手坐下', goto:'skinstealer_death' },
          { label:'借口找洗手间，慢慢退出门', goto:'homely', effects:[['sanity',-3]] },
        ]},

      reveal_skinstealer:{ id:'reveal_skinstealer',
        text:'镜面里——那把椅子是空的。"他"的笑容凝固，随即整张人皮像松脱的戏服一样滑塌，底下是湿亮的、过长的肢节：剥皮者（Skin-Stealer）。它不追正盯着它看的人，它只在你转过身、放下戒备时下手。你横着挪到门边，背贴着数百扇门退出去。其中一扇，门缝里漏出的不是旅馆的金光，而是熟悉的、泛黄的荧光——传说中的低概率出口，正好坠回那片黄走廊。',
        onEnter:[['sanity',-6],['flag','saw_skinstealer',true]],
        choices:[
          { label:'闪身钻进那扇泛黄的门（→ Level 0）', goto:'L0:corridors', effects:[['stamina',-6]] },
          { label:'先退回家常酒店稳住神', goto:'homely', effects:[['sanity',4]] },
        ]},

      skinstealer_death:{ id:'skinstealer_death',
        text:'你握住了那只手——太凉，关节太多。等你反应过来转身要走，它早算准了这一刻。最后你看见的，是自己那张脸被它温柔地揭下来，对着镜子试穿，调整笑容的弧度，直到比你本人更像你。',
        choices:[ { label:'……', ending:'replaced' } ]},

      ballroom:{ id:'ballroom',
        text:'舞厅没有灯，却挤满了"派对"——几百个声音在黑暗里碰杯、寒暄、低笑，可没有一个人影。空气里浮着甜腻的尘埃，触到皮肤就发痒。这是死亡飞蛾（Death Moth）的巢穴：它们靠这片"聚会的嗡语"诱人深入，鳞粉一旦吸饱，就会从内里啃噬。墙角立着一块掉漆的告示："请勿循声而行，请勿挥手驱赶，屏息低身，背墙退出。"',
        onEnter:[['sanity',-6]],
        choices:[
          { label:'屏息低身，背贴墙慢慢退回', goto:'main_hall', effects:[['sanity',-4],['stamina',-5]] },
          { label:'挥手扇开扑脸的鳞粉、循人声找门', goto:'moth_death' },
        ]},

      moth_death:{ id:'moth_death',
        text:'你的动作把整片黑暗惊醒。"派对声"骤然合拢成振翅的轰鸣，无数飞蛾扑上口鼻。甜痒钻进肺里，从内壁开始一寸寸啃食。你想喊，吸进去的全是鳞粉。聚会，至此圆满——你成了今晚的主菜。',
        choices:[ { label:'……', ending:'collapse' } ]},

      boiler:{ id:'boiler',
        text:'楼梯尽头是锅炉房：旧机器与工业管道纵横交错，蒸汽糊住视线，温度高得衬衫立刻贴上脊背。爵士乐在这里只剩闷响。深处一台主控盘上排着一列总闸，最末一根标着早已褪色的字——"夜间熄灯 / NIGHT-OUT"。家常酒店说过：从锅炉房熄了灯就能出去。但热浪里管道盘成迷宫，走错一步就是闷死在蒸汽里。',
        variants:{
          dread:'蒸汽里仿佛站着一排沉默的人形，是木灵，还是你自己被热气扭曲的影子？你不敢确认。',
          broken:'管道在你眼里全长一个样。总闸有十根、一百根、还是只有一根？字早就化了。你伸手——朝哪个方向都行，反正你已经分不清出口和坟墓。' },
        onEnter:[['sanity',-3],['stamina',-5]],
        choices:[
          { label:'扳下"夜间熄灯"总闸（→ Level 6）', goto:'lights_out' },
          { label:'热得受不了，退回主厅', goto:'main_hall', effects:[['stamina',-4]] },
        ]},

      lights_out:{ id:'lights_out',
        text:'你扳下总闸。全旅馆的灯、唱片机、那几百个看不见的声音——同时熄灭。绝对的黑里，蒸汽是温的，地面在轻轻下沉。脚下不再是锅炉房的水泥，而是某种潮湿、起伏、像活物表皮的东西。熄灯之后没有黎明：你正坠入下一层。',
        onEnter:[['flag','lights_out',true]],
        choices:[
          { label:'随这片黑暗一起下沉（→ Level 6）', goto:'L6:entry', effects:[['sanity',-5],['stamina',-6]] },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
