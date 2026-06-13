(function (g) {
  const GAME = (g.GAME = g.GAME || {}); GAME.orgs = GAME.orgs || {};
  GAME.orgs.meg  = { id:'meg',  name:'M.E.G.（主要探索者集团）', stance:'援助', desc:'层级测绘与互助，发放杏仁水与情报。' };
  GAME.orgs.uec  = { id:'uec',  name:'UEC（无垠探索者联盟）',    stance:'硬核', desc:'深潜探索、记录未知层级，risk-tolerant。' };
  GAME.orgs.lost = { id:'lost', name:'The Lost（迷失者）',        stance:'危险邪教', desc:'崇拜后室本身，诱骗流浪者交出自我。' };
})(typeof window !== 'undefined' ? window : globalThis);
