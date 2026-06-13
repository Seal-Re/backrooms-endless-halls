(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.items = GAME.items || {};
  const I = GAME.items;
  I.almond_grey  = { id:'almond_grey',  name:'杏仁水·灰', desc:'最基础的营养来源。', use:[['thirst',-50],['stamina',30],['sanity',15]] };
  I.almond_green = { id:'almond_green', name:'杏仁水·绿', desc:'提神，但会成瘾。', use:[['stamina',50],['flag','addicted',true]] };
  I.almond_red   = { id:'almond_red',   name:'杏仁水·红', desc:'药用，可驱退剥皮者；过量致癌。', use:[['sanity',10],['flag','took_red',true]], cooldown:30 };
  I.almond_blue  = { id:'almond_blue',  name:'杏仁水·蓝', desc:'抗心灵影响，稳定理智。', use:[['sanity',30]] };
  I.firesalt   = { id:'firesalt',   name:'火盐',   desc:'点燃可短暂驱退实体。', use:[['flag','firesalt_ready',true]] };
  I.mirror     = { id:'mirror',     name:'镜子',   desc:'可验明拟态 / 剥皮者。', use:[['flag','mirror_used',true]] };
  I.liquid_pain= { id:'liquid_pain',name:'液态痛苦',desc:'某些组织的硬通货。', use:[] };
  I.flashlight = { id:'flashlight', name:'手电',   desc:'照亮黑暗，消耗电池。', use:[] };
  I.battery    = { id:'battery',    name:'电池',   desc:'手电的燃料。', use:[] };
})(typeof window !== 'undefined' ? window : globalThis);
