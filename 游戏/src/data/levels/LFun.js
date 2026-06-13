(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.levels = GAME.levels || {};
  GAME.levels.LFun = {
    id:'LFun', name:'Level Fun 欢乐层级', class:3, danger:'永恒狂欢·篡改', safe:false,
    entities:['partygoer'],
    nodes:{
      entry:{ id:'entry',
        text:'暖风把你送进一间无限延伸的派对房。气球贴着天花板，长桌上摆满纸杯蛋糕，墙上钉着画得歪歪扭扭的卡通动物。一只挂钟在滴答，背后是放慢了的《生日快乐歌》，黏稠得像糖浆。没有人。蛋糕上的奶油是新鲜的。',
        variants:{
          dread:'……气球太多了。每一只都在极缓慢地转向你这边。歌声慢得能听清每个走调的音节。墙上的卡通笑脸，刚才是不是没有这么多张？',
          broken:'生日快乐——亲爱的——你！蜡烛替你点好了，座位牌上写着你的名字，你迟到了好久好久。坐下吧。坐下吧。它们一直在等你。一直在等你。' },
        onEnter:[['sanity',-4]],
        choices:[
          { label:'贴墙绕行，找异常的门', goto:'corridor' },
          { label:'走近长桌看那些蛋糕', goto:'table' },
          { label:'循着歌声往房间深处走', goto:'hall' },
        ]},
      table:{ id:'table',
        text:'纸杯蛋糕上插着小旗。靠近了你才发现：奶油里嵌着指甲，蛋糕胚的截面有发丝的纹理。一张手写卡片摆在最前面，字迹工整：「随便吃 =) 这都是为你准备的」。你的胃在叫，水也快没了。',
        onEnter:[['sanity',-5]],
        choices:[
          { label:'尝一口（它说这是为你准备的）', goto:'feast_death' },
          { label:'想起警告：不信任何带「=)」的东西，退开', goto:'corridor', effects:[['sanity',3]] },
          { label:'翻找桌下被遗落的补给', goto:'table_loot' },
        ]},
      table_loot:{ id:'table_loot',
        text:'你蹲到长桌底下。糖纸、断掉的派对帽、一个被踩扁的礼盒。礼盒里有一只还能用的手电，旁边滚着两瓶杏仁水·绿——某个流浪者没来得及带走。',
        onEnter:[['give','flashlight',1],['give','almond_green',2]],
        choices:[
          { label:'抱着东西离开长桌', goto:'corridor', effects:[['sanity',2]] },
        ]},
      feast_death:{ id:'feast_death',
        text:'入口即化。甜，太甜，甜到你尝不出那底下咸腥的东西。第二口时房间忽然亮起来——它们一直坐在你看不见的座位上，齐声拍手。亮黄的皮革手掌，脸上是同一张印死的笑。你已经是派对的一部分了。蜡烛为你而点。',
        choices:[
          { label:'……（吹灭蜡烛）', ending:'sanity_zero' },
        ]},
      corridor:{ id:'corridor',
        text:'你贴着墙走。装饰一段比一段陈旧：褪色的彩带、瘪掉的气球、墙上的卡通笑脸被刮花。歌声在这里变远了。前方有三处岔口——一扇画着老虎的双开门，一道半掩的活动板房门缝里透出柔和的烛光，还有一段彩带尽头的安静角落。',
        onEnter:[['sanity',-2]],
        choices:[
          { label:'去彩带尽头的安静角落歇脚', goto:'quiet' },
          { label:'推开画着老虎的双开门', goto:'door_room' },
          { label:'凑近那道透出烛光的门缝', goto:'lost_camp' },
          { label:'喝一口杏仁水·绿', requires:(s)=>!!s.inv.almond_green, goto:'corridor', noTick:true, effects:[['take','almond_green',1],['thirst',-45],['sanity',10],['stamina',20]] },
        ]},
      quiet:{ id:'quiet',
        text:'彩带的尽头是一个被遗忘的小隔间，三面是堆叠的礼盒，挡住了歌声和那些笑脸。空气里没有甜味。你把礼盒摞得更高，背靠墙坐下，第一次能听见自己的呼吸。',
        choices:[
          { label:'休整（存档点）', goto:'quiet', noTick:true, effects:[['sanity',8]] },
          { label:'回到走廊继续找出口', goto:'corridor' },
          { label:'检查礼盒堆深处', goto:'quiet_loot' },
        ]},
      quiet_loot:{ id:'quiet_loot',
        text:'最里面的礼盒没有包装纸，沉甸甸的。里面是一小袋火盐和一面巴掌大的镜子——M.E.G. 的标准随身包，主人不知去向。',
        onEnter:[['give','firesalt',1],['give','mirror',1]],
        choices:[
          { label:'收好，回到隔间', goto:'quiet', effects:[['sanity',2]] },
        ]},
      door_room:{ id:'door_room',
        text:'门后是又一间派对房，但这次有人——一个亮黄色的高大身影站在桌边，手里攥着一束气球，脸上印着卡通笑脸，缓缓朝你转过来，举起另一只手向你招手，热情得近乎温柔。这是 Partygoer（派对客）。它身后的墙角，有一道没画完的、抖动的门缝。',
        onEnter:[['sanity',-7]],
        choices:[
          { label:'挥手回应，走过去接住它递来的气球', goto:'invite_death' },
          { label:'站住不动，保持安静，慢慢挪向墙角的门缝', goto:'sneak' },
          { label:'用镜子照它', requires:(s)=>!!s.inv.mirror, goto:'mirror_check' },
          { label:'转身退回走廊', goto:'corridor', effects:[['sanity',-3]] },
        ]},
      invite_death:{ id:'invite_death',
        text:'你接住了气球。它的手掌合上来，皮革一样的指头贴上你的脸颊，温度低得反常。「来玩呀。」更多亮色的身影从四面的门里涌出来，拍着手围成一圈。它们有的是要把你转化成同类，有的只想把你做成下一批纸杯蛋糕——对你而言没有区别。圈子收紧了。',
        choices:[
          { label:'……', ending:'sanity_zero' },
        ]},
      mirror_check:{ id:'mirror_check',
        text:'你举起镜子。镜面里那张卡通笑脸纹丝不动——但它的身体在镜中是空的，气球的影子也没有。它仍在向你招手，姿态没变，却显然不知道自己已经被看穿。趁这一瞬的停滞，墙角抖动的门缝就在你左手边。',
        onEnter:[['flag','partygoer_seen',true],['sanity',-2]],
        choices:[
          { label:'屏住呼吸，钻进抖动的门缝', goto:'glitch_exit' },
          { label:'慢慢退回走廊', goto:'corridor', effects:[['sanity',-4]] },
        ]},
      sneak:{ id:'sneak',
        text:'你定住。它的笑脸朝向你，气球在它手里轻轻浮动。你一寸一寸往墙角的门缝挪。它没有追——但更多脚步声正从隔壁的门后聚拢过来，欢笑的嗡鸣一点点变大。门缝就在伸手可及处，再快一点就会惊动它们。',
        choices:[
          { label:'冷静地继续挪向门缝（不要跑）', goto:'glitch_exit', effects:[['stamina',-5]] },
          { label:'撒腿冲向门缝', goto:'invite_death' },
        ]},
      hall:{ id:'hall',
        text:'歌声把你引到一处亮着烛光的长廊。一群披着彩色斗篷的人围坐成圈，平静地哼着调子。他们不是派对客——是 The Lost（迷失者），自愿留在这层的人。一个戴花冠的女人抬起头，温和地朝你笑：「你看起来很累。把你自己交给这里，就再也不用走了。我叫 Meg，加入我们吧。」',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'坐进圈子，听他们说', goto:'lost_camp' },
          { label:'摇头，退回走廊', goto:'corridor', effects:[['sanity',-2]] },
        ]},
      lost_camp:{ id:'lost_camp',
        text:'烛光里，迷失者们传递着一只空碗。「外面没有出口，」戴花冠的人轻声说，「只有这里。放下名字，放下要去哪里的念头，你就自由了。喝下去，你就属于这里了。」碗递到你面前。圈子里每张脸都松弛、空洞、满足。这很有诱惑——你确实太累了。',
        onEnter:[['sanity',-4]],
        choices:[
          { label:'接过碗，把自己交出去', goto:'cult_surrender' },
          { label:'咬住舌头，提醒自己还有要去的地方，起身', requires:(s)=>s.sanity>20, goto:'corridor', effects:[['sanity',-5],['stamina',-5]] },
          { label:'用火盐划一道界，逼退他们的手', requires:(s)=>!!s.inv.firesalt, goto:'corridor', effects:[['take','firesalt',1],['sanity',4]] },
        ]},
      cult_surrender:{ id:'cult_surrender',
        text:'碗里的东西是温的，没有味道。你喝下去的那一刻，「要去哪里」这个念头先消失了，然后是你的名字，然后是你为什么会在这里。哼唱声把你接了进去。圈子又多了一张松弛而满足的脸。你再也不会想要离开。',
        choices:[
          { label:'……', ending:'cult_lost' },
        ]},
      glitch_exit:{ id:'glitch_exit',
        text:'门缝里没有甜味，也没有歌声——只有一片刺眼的、压抑的白，像被强光漂洗过的虚无。这是后室里极少有人能找到的隐藏裂缝，通往 Level !（无光之地）。身后派对房的笑声正在逼近，你只有一次机会。',
        onEnter:[['sanity',-3]],
        choices:[
          { label:'纵身钻进白色的裂缝（→ Level !）', goto:'LExcl:entry', effects:[['stamina',-10]] },
          { label:'害怕了，缩回派对房', goto:'door_room', effects:[['sanity',-6]] },
        ]},
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
