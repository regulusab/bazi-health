/* app.js — 介面、匯出（ES5） */
(function(){
var D=window.HEALTH_DATA,H=window.HC,$=function(i){return document.getElementById(i);};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function srcTxt(keys){return '來源待核（參考外站：'+keys.map(function(k){return D.src[k].n+' '+D.src[k].u;}).join('；')+'）';}
function srcHtml(keys){return '<div class="src" data-t="'+esc(srcTxt(keys))+'">來源待核（參考外站：'+keys.map(function(k){return '<a href="'+D.src[k].u+'" target="_blank" rel="noopener">'+esc(D.src[k].n)+'</a>';}).join('；')+'）</div>';}
// 下拉
var pg=$('pg'),LAB=['年','月','日','時'];
for(var i=0;i<4;i++){var h='<div><label>'+LAB[i]+'干</label><select id="g'+i+'">';H.GAN.forEach(function(g){h+='<option>'+g+'</option>';});
 h+='</select><label>'+LAB[i]+'支</label><select id="z'+i+'">';H.ZHI.forEach(function(z){h+='<option>'+z+'</option>';});pg.insertAdjacentHTML('beforeend',h+'</select></div>');}
function setP(p){BIRTH=null;for(var i=0;i<4;i++){$('g'+i).value=p[i].charAt(0);$('z'+i).value=p[i].charAt(1);}}
function getP(){var p=[];for(var i=0;i<4;i++)p.push($('g'+i).value+$('z'+i).value);return p;}
setP(H.SAMPLE.pillars);
$('calc').onclick=function(){var d=$('bd').value,t=$('bt').value||'12:00';if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){$('cnote').textContent='請輸入日期';return;}
 var a=d.split('-'),b=t.split(':');var f=H.fromSolar(+a[0],+a[1],+a[2],+b[0],+b[1],parseFloat($('tz').value)||8,$('lz').checked);setP(f.pillars);BIRTH={y:+a[0],m:+a[1],d:+a[2],h:+b[0],mi:+b[1],tz:parseFloat($('tz').value)||8};
 $('cnote').textContent='排得：'+f.pillars.join(' ')+(f.note?'（'+f.note+'）':'')+'。節氣以太陽黃經近似計算，未作真太陽時校正；出生在節氣交界前後請自行核對。';};
var last=null,SG={horiz:false,mode:'season',year:new Date().getFullYear(),dy:'auto',method:(function(){try{return localStorage.getItem('healthMethod')==='m2'?'m2':'m1';}catch(e){return 'm1';}})()},BIRTH=null;
var WC={木:'#2e7d32',火:'#c62828',土:'#a0782a',金:'#707070',水:'#1f5fa8'};
var BADGE={旺:['最旺（旺）','background:#a52a1e;color:#fff'],相:['次旺（相）','background:#f8d7d3;color:#a52a1e'],休:['衰（休）','border:1px solid #aaa;color:#666'],囚:['次衰（囚）','background:#dbe6f3;color:#1f3a52'],死:['最衰（死）','background:#1f3a52;color:#fff']};
function cz(t){var o='';for(var i=0;i<t.length;i++)o+='<span style="color:'+WC[H.wxOf(t.charAt(i))]+'">'+t.charAt(i)+'</span>';return o;}
function czLab(t){var o='';for(var i=0;i<t.length;i++)o+=cz(t.charAt(i))+(t.length>1?'<sub class="u" style="font-size:10px">'+D.cangLab[i]+'</sub>':'');return o;}
function badge(st){var b=BADGE[st];return '<span class="bd" style="'+b[1]+'">'+b[0]+'</span>';}
function sgHtml(R){var p=R.pillars,S=H.shigan(p,D),FO=H.bookForce(S.cnt),o=[],ord=[3,2,1,0],i;
 o.push('<h2>十干臟腑表　<span class="note">吳俊民式：只用天干、地支全換藏干</span></h2>');
 var hd=['時柱','日柱','月柱','年柱'],rows=[['天干'],['地支（捨）'],['藏干']];
 ord.forEach(function(k){rows[0].push(cz(p[k].charAt(0)));rows[1].push('<small class="u">'+p[k].charAt(1)+'</small>');rows[2].push(czLab(S.cang[k]));});
 if(!SG.horiz){o.push('<table class="sg"><tr><th></th>'+hd.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr>');rows.forEach(function(r){o.push('<tr><th>'+r[0]+'</th>'+r.slice(1).map(function(c){return '<td class="big2">'+c+'</td>';}).join('')+'</tr>');});o.push('</table>');}
 else{o.push('<table class="sg"><tr><th></th>'+rows.map(function(r){return '<th>'+r[0]+'</th>';}).join('')+'</tr>');for(i=0;i<4;i++)o.push('<tr><th>'+hd[i]+'</th>'+rows.map(function(r){return '<td class="big2">'+r[i+1]+'</td>';}).join('')+'</tr>');o.push('</table>');}
 o.push('<div class="row noexp"><button class="sec" id="sgH">切換為'+(SG.horiz?'直式':'橫式')+'表格</button>'+(S.siji?'<span>辰戌丑未月判法：<select id="sgM"><option value="tu"'+(SG.mode==='tu'?' selected':'')+'>以土為旺</option><option value="season"'+(SG.mode==='season'?' selected':'')+'>以季節為旺</option></select></span>':'')+'</div>');
 var cols=S.siji?[['tu','以土為旺（土旺）',S.tu],['season','以季節為旺（'+S.seasonWx+'旺）',S.season]]:[['season','以季節為旺（'+S.seasonWx+'旺）',S.season]];
 o.push('<div class="scr"><table class="sg2"><tr><th>十干</th><th>臟腑</th><th>數量</th><th>得生</th><th>遭剋</th><th>洩</th>'+cols.map(function(c){return '<th'+(S.siji&&SG.mode===c[0]?' class="sel"':'')+'>衰旺<br>'+c[1]+'</th>';}).join('')+'</tr>');
 H.GAN.forEach(function(g,gi){var n=S.cnt[g],w=H.wxOf(g),ring='';for(var q=0;q<n;q++)ring+='○';
  var f=FO[g],tr='<tr><td class="big2">'+cz(g)+'</td><td>'+D.bookOrgan[g]+'</td><td'+(n?'':' style="background:#fbe3e6"')+'>'+(n?ring:'—')+'</td><td>'+f.sheng+f.shengN+'</td><td>'+f.ke+f.keN+'</td><td>'+f.xie+f.xieN+'</td>';
  if(gi%2===0)cols.forEach(function(c){tr+='<td rowspan="2"'+(S.siji&&SG.mode===c[0]?' class="sel"':'')+'>'+badge(c[2][w])+'</td>';});
  o.push(tr+'</tr>');});
 o.push('</table></div><p class="note">本命天干4字＋藏干'+(S.total-4)+'字，共'+S.total+'字；藏干不分本氣、中氣、餘氣，各計一個圈。'+(S.siji?'月令'+p[1].charAt(1)+'為辰戌丑未月，兩種衰旺並列，框線為目前選用的判法（在上方「辰戌丑未月判法」切換）。':'月令'+p[1].charAt(1)+'，依季節旺相休囚死。')+'</p>');
 o.push('<p class="note">'+D.cangNote+'外站另載辰戌丑未月前十二天有「餘氣」之說，以及吳俊民原書另加「命宮」一柱、並提及「照五行用事」之當令法，本表均未採用。</p>');
 o.push('<p class="note">得生／遭剋／洩欄：依書影例句之配對（甲得壬生、遭庚剋、洩於丙，餘類推，同陰陽相配）計算干數——此配對為本站由例句歸納之推論。書中「力量」判語（最強／稍強／中平／不弱…）無明確公式，本站不自動判定。</p>');
 o.push('<p class="src" data-t="來源：'+esc(D.bookSrc)+'">來源：'+esc(D.bookSrc)+'</p>');
 o.push('<h3>書影轉錄（第1083頁例）</h3>');D.bookText.forEach(function(t){o.push('<p class="note">'+esc(t)+'</p>');});o.push('<p class="note">'+esc(D.bookNote)+'</p>');
 o.push('<p class="src" data-t="十干臟腑對應：'+D.geSrc+'天干十二經表裡歌（書作「心臟」「腎」＝歌之「心」「腎臟」）">十干臟腑對應：'+D.geSrc+'天干十二經表裡歌（書作「心臟」「腎」＝歌之「心」「腎臟」）</p>');
 o.push(srcHtml(D.shiganSrc)+srcHtml(D.wxsSrc));
 o.push(lnHtml(R,S));
 return o.join('');}
function geHtml(R){var p=R.pillars,S=H.shigan(p,D),G=H.gejue(p,D),o=[];
 o.push('<h2>健康檢查表　<span class="note">歌訣法：天干依表裡歌、地支依流注歌，共8明字</span></h2>');
 if(S.siji)o.push('<div class="row noexp">辰戌丑未月判法：<select id="sgM"><option value="tu"'+(SG.mode==='tu'?' selected':'')+'>以土為旺</option><option value="season"'+(SG.mode==='season'?' selected':'')+'>以季節為旺</option></select></div>');
 var cols=S.siji?[['tu','以土為旺',S.tu],['season','以季節為旺（'+S.seasonWx+'旺）',S.season]]:[['season','以季節為旺（'+S.seasonWx+'旺）',S.season]];
 o.push('<div class="scr"><table class="sg2"><tr><th>臟腑</th><th>來自天干</th><th>來自地支</th><th>合計</th><th>五行</th>'+cols.map(function(c){return '<th'+(S.siji&&SG.mode===c[0]?' class="sel"':'')+'>衰旺<br>'+c[1]+'</th>';}).join('')+'</tr>');
 G.forEach(function(r){var ring='';for(var q=0;q<r.n;q++)ring+='○';
  o.push('<tr><td><b>'+r.organ+'</b></td><td>'+(r.gan.join('、')||'')+'</td><td>'+(r.zhi.join('、')||'')+'</td><td'+(r.n?'':' style="background:#fbe3e6"')+'>'+(r.n?ring:'—')+'</td><td style="color:'+WC[r.wx]+'">'+r.wx+'</td>'+cols.map(function(c){return '<td'+(S.siji&&SG.mode===c[0]?' class="sel"':'')+'>'+badge(c[2][r.wx])+'</td>';}).join('')+'</tr>');});
 o.push('</table></div><p class="note">每個明字各計一次，共8；不計藏干。'+(S.siji?'月令'+p[1].charAt(1)+'為辰戌丑未月，兩種衰旺並列，框線為目前選用之判法。':'衰旺依月令旺相休囚死。')+'</p>');
 o.push('<p class="src" data-t="天干→臟腑：'+D.geSrc+'天干十二經表裡歌；地支→經絡：'+D.geSrc+'地支十二經流注歌">天干→臟腑：'+D.geSrc+'天干十二經表裡歌；地支→經絡：'+D.geSrc+'地支十二經流注歌</p>');
 o.push('<p class="note">'+esc(D.m1WxNote)+'</p>'+srcHtml(D.wxOrganSrc)+srcHtml(D.wxsSrc));
 o.push('<p class="note">本表天干、地支之臟腑對應與外站「八字明字對照表」截圖一致（如甲／子·膽、辛／寅·肺），其計數說明：'+esc(D.mingziNote)+'</p><p class="src" data-t="'+D.shotSrc+'">'+D.shotSrc+'</p>');
 o.push(lnHtml(R,S));return o.join('');}
function mzHtml(R){var M=H.mingzi(R.pillars,D),o=['<h2>八字明字對照表　<span class="note">附圖規則／12欄明字計數</span></h2><table><tr><th>干／支·臟腑</th><th>圖表五行</th><th>明字數</th></tr>'];
 M.forEach(function(m){o.push('<tr><td>'+m.g+'／'+m.z+'·'+m.organ+'</td><td style="color:'+WC[m.wx]+'">'+m.wx+'</td><td'+(m.n?'':' class="u"')+'>'+m.n+' 字</td></tr>');});
 o.push('</table><p class="note">'+esc(D.mingziNote)+'</p><p class="src" data-t="'+D.shotSrc+'">'+D.shotSrc+'</p>');return o.join('');}
function lnHtml(R,S){var p=R.pillars,DY=H.dayun(p,R.gender,BIRTH),y=SG.year,ln=H.yearGZ(y),dy=null,o=[];
 if(DY.startAge!=null){var age=y-DY.birthYear,k=Math.floor((age-DY.startAge)/10);if(age>=DY.startAge&&k<8)dy=DY.list[k];}
 if(SG.dy!=null&&SG.dy!=='auto')dy=SG.dy===''?null:SG.dy;
 o.push('<h2>流年／大運臟腑表</h2><div class="row noexp">流年 <input type="number" id="lnY" value="'+y+'" style="width:90px"> 大運 <select id="dyS"><option value="auto">'+(DY.startAge!=null?'依生辰自動':'（未輸入生辰）')+'</option><option value="">不計</option>'+DY.list.map(function(g,i){return '<option'+(SG.dy===g?' selected':'')+' value="'+g+'">'+g+(DY.startAge!=null?'（'+(Math.round((DY.startAge+i*10)*10)/10)+'歲起）':'')+'</option>';}).join('')+'</select></div>');
 o.push('<p>流年 '+y+' '+ln+'；大運 '+(dy||'—')+'（'+(DY.fwd?'順':'逆')+'行'+(DY.startAge!=null?'，約 '+(Math.round(DY.startAge*10)/10)+' 歲起運':'')+'）</p>');
 var chars=[];p.forEach(function(x){chars.push(x.charAt(0),x.charAt(1));});var yun=[ln.charAt(0),ln.charAt(1)];if(dy)yun.push(dy.charAt(0),dy.charAt(1));
 var M=D.mingzi.slice(0,10).concat([D.mingzi[10],D.mingzi[11]]),hdr=['地支','天干','色','五行','臟腑','經脈','本命','運歲','衰旺'],rows=hdr.map(function(h){return['<th>'+h+'</th>'];});
 M.forEach(function(m){var g=m[0].replace('寄',''),z=m[1],real=m[0].indexOf('寄')<0,st='',sy='',i;
  for(i=0;i<chars.length;i++)if(chars[i]===z||(real&&chars[i]===g))st+='★';for(i=0;i<yun.length;i++)if(yun[i]===z||(real&&yun[i]===g))sy+='☆';
  rows[0].push('<td class="big2">'+cz(z)+'</td>');rows[1].push('<td class="big2">'+(real?cz(g):'<small>'+m[0]+'</small>')+'</td>');
  rows[2].push('<td>'+(D.lnColor[z]||'<span class="u">截圖未見</span>')+'</td>');rows[3].push('<td style="color:'+WC[m[3]]+'">'+m[3]+'</td>');rows[4].push('<td>'+m[2]+'</td>');
  rows[5].push('<td>'+(D.lnMeridian[z]||D.zhiJing[z]+'<br><small class="u">'+D.lnMeridianWiki[z]+'＊</small>')+'</td>');rows[6].push('<td'+(st?'':' style="background:#fbe3e6"')+'>'+(st||'')+'</td>');rows[7].push('<td>'+sy+'</td>');rows[8].push('<td>'+badge(S.season[m[3]])+'</td>');});
 o.push('<div class="scr"><table class="ln">'+rows.map(function(r){return '<tr>'+r.join('')+'</tr>';}).join('')+'</table></div>');
 o.push('<p class="note">'+esc(D.lnNote)+' 原圖另有「力量」列（最強／中平／稍弱／甚弱），截圖未示其判定規則，本站不計算。截圖僅見子丑未午辰巳六欄，其後各欄之色未見；其後各欄經脈之臟腑依《醫宗金鑑》地支十二經流注歌（使用者提供）；＊全經名參維基百科「子午流注」。大運起運依「陽男陰女順、陰男陽女逆，出生至節氣日數÷3＝歲」常法計算（本站設定），節氣為近似計算。</p><p class="src" data-t="'+D.shotSrc+'">'+D.shotSrc+'</p>');
 return o.join('');}
function setM(m){SG.method=m;try{localStorage.setItem('healthMethod',m);}catch(e){}render(last);}
function bindSG(){var b1=$('mB1'),b2=$('mB2');if(b1)b1.onclick=function(){setM('m1');};if(b2)b2.onclick=function(){setM('m2');};var ly=$('lnY'),ds=$('dyS');if(ly)ly.onchange=function(){SG.year=parseInt(ly.value,10)||SG.year;render(last);};if(ds)ds.onchange=function(){SG.dy=ds.value;render(last);};var a=$('sgH'),b=$('sgM');if(a)a.onclick=function(){SG.horiz=!SG.horiz;render(last);};if(b)b.onchange=function(){SG.mode=b.value;render(last);};}
function render(R){var s=[];
 s.push('<h2>命盤</h2><div class="big">'+R.pillars.join('　')+'</div><div>'+R.gender+'造　日主 '+R.dm.c+'（'+R.dm.wx+'）</div>');
 var M2=SG.method==='m2',MN=M2?'方法二「吳俊民法（天干＋藏干）」':'方法一「歌訣法（天干＋地支）」';
 s.push('<div class="row noexp msw"><b>健康判斷方法：</b><button id="mB1" class="'+(M2?'sec':'')+'">方法一 歌訣法（天干＋地支）</button><button id="mB2" class="'+(M2?'':'sec')+'">方法二 吳俊民法（天干＋藏干）</button></div>');
 s.push('<p><b>本報告採用：'+MN+'</b></p>');
 s.push('<h2>一、天干疾病斷訣（使用者提供）</h2><table><tr><th>位置</th><th>干</th><th>斷訣定位</th></tr>');
 R.stems.forEach(function(x){s.push('<tr><td>'+x.pos+'</td><td>'+x.c+'</td><td'+(x.uncertain?' class="u"':'')+'>'+esc(x.text)+(x.uncertain&&!/定位|確定|確切/.test(x.text)?'（難以具體定位）':'')+'</td></tr>');});
 s.push('</table><h2>二、地支疾病定位（使用者提供）</h2><table><tr><th>位置</th><th>支</th><th>定位</th></tr>');
 R.branches.forEach(function(x){s.push('<tr><td>'+x.pos+'</td><td>'+x.c+'</td><td'+(x.uncertain?' class="u"':'')+'>'+esc(x.text)+(x.uncertain&&!/定位|確定|確切/.test(x.text)?'（定位不確切）':'')+'</td></tr>');});
 s.push('</table><p class="note">'+esc(D.userNote)+'</p>');
 s.push('<h2>三、四柱部位與干支配臟腑</h2><table><tr><th>柱</th><th>部位</th><th>天干臟腑／身體</th><th>地支臟腑</th></tr>');
 for(var i=0;i<4;i++)s.push('<tr><td>'+H.POS[i]+'柱 '+R.pillars[i]+'</td><td>'+D.pillarZone[i]+'</td><td>'+R.stems[i].c+'：'+R.stems[i].organ+'／'+R.stems[i].body+'</td><td>'+R.branches[i].c+'：'+R.branches[i].organ+'</td></tr>');
 s.push('</table>'+srcHtml(D.pillarZoneSrc)+srcHtml(['smth','jwz']));
 s.push('<h2>四、五行統計（天干地支表面五行，共八字）</h2><table><tr>');H.WX.forEach(function(w){s.push('<th>'+w+'</th>');});s.push('</tr><tr>');H.WX.forEach(function(w){s.push('<td>'+R.count[w]+'</td>');});
 s.push('</tr><tr>');H.WX.forEach(function(w){s.push('<td class="note">'+D.wxOrgan[w]+'</td>');});s.push('</tr></table>'+srcHtml(D.wxOrganSrc.concat(['suanw'])));
 s.push('<p><b>缺：</b>'+(R.missing.length?R.missing.map(function(w){return w+'（'+D.wxOrgan[w]+'；受虧主病：'+D.wxDeficit[w]+'）';}).join('；'):'無')+'</p>'+srcHtml(D.wxDeficitSrc));
 s.push('<p><b>被剋：</b>'+(R.keHit.length?R.keHit.map(function(k){return k.wx+'（'+k.n+'）被'+k.by+'（'+k.kn+'）剋 → '+D.wxKe[k.wx];}).join('；'):'無明顯')+'</p>'+srcHtml(D.wxKeSrc)+'<p class="note">「多」的門檻：剋方 ≥2 個且不少於被剋方——此為本站計算設定，非原文。</p>');
 s.push('<h2>歌訣</h2>'+D.geRhymes.map(function(r){return '<p><b>'+r[0]+'</b>：'+r[1]+'</p>';}).join('')+'<p class="src" data-t="來源：'+D.geSrc+'">來源：'+D.geSrc+'</p>');
 s.push(M2?sgHtml(R):geHtml(R));
 var d=R.dm;s.push('<h2>五、日主強弱</h2><p>日主 '+d.c+d.wx+'；月令'+(d.ling?'得令（'+d.ling+'）':'失令')+'；年日時支根（同類或生我）：'+(d.roots.length?d.roots.join('、'):'無')+'；其餘七字生扶 '+d.help+'、剋洩耗 '+d.opp+' → <b>'+d.level+'</b>（依韋千里六級）</p>'+srcHtml(D.strengthSrc)+'<p class="note">僅以表面五行計，未計藏干、長生十二宮及調候。</p>');
 s.push('<h2>六、沖剋（受病之處參考）</h2>'+(R.chong.length?'<ul>'+R.chong.map(function(c){return '<li>'+c.a+' 沖 '+c.b+'：'+esc(c.text)+'</li>';}).join('')+'</ul>':'<p>原局無天干四沖、地支六沖。</p>')+srcHtml(D.chongSrc.concat(D.stemChongSrc)));
 s.push('<h2>七、十二經絡流注</h2><p>出生時支 '+R.hourZhi+'：'+D.zhiJing[R.hourZhi]+'經（'+D.ziwu[R.hourZhi]+'）</p><p class="src" data-t="來源：'+D.geSrc+'地支十二經流注歌；全經名'+esc(srcTxt(D.ziwuSrc))+'">來源：'+D.geSrc+'地支十二經流注歌；全經名參維基</p>'+'<p>'+R.hourZhi+'時生人'+D.birthHour[R.hourZhi]+'</p>'+srcHtml(D.birthHourSrc));
 var need=R.missing.concat(R.keHit.map(function(k){return k.wx;})).filter(function(w,i,a){return a.indexOf(w)===i;});
 s.push('<h2>八、養生參考</h2><p>'+(need.length?need.map(function(w){return w+'：'+D.yang[w];}).join('；')+'。':'')+D.yangNote+'</p>'+srcHtml(D.yangSrc)+'<p>'+D.sleep+'</p>'+srcHtml(D.sleepSrc));
 s.push('<p class="warn">命理參考，非醫療診斷。外站規則均「來源待核」。</p>');
 $('out').innerHTML='<div class="card" id="rep">'+s.join('')+'</div>';$('exp').style.display='flex';bindSG();}
$('go').onclick=function(){last=H.analyze(getP(),D,$('sex').value);render(last);};
/* ---- 匯出：以 DOM 文字為內容 ---- */
function blocks(){var out=[],els=$('rep').children;for(var i=0;i<els.length;i++){var e=els[i],t=e.tagName;if(/noexp/.test(e.className))continue;if(/scr/.test(e.className)){e=e.querySelector('table');t='TABLE';}
 if(t==='TABLE'){var rows=[],tr=e.querySelectorAll('tr');for(var r=0;r<tr.length;r++){var c=[],cs=tr[r].children;for(var j=0;j<cs.length;j++)c.push(cs[j].textContent);rows.push(c);}out.push({k:'table',rows:rows});}
 else if(t==='UL'){var li=e.querySelectorAll('li');for(var q=0;q<li.length;q++)out.push({k:'p',t:'・'+li[q].textContent});}
 else if(e.getAttribute('data-t'))out.push({k:'s',t:e.getAttribute('data-t')});
 else out.push({k:(t==='H2'||t==='H3')?'h':(e.className==='src'||e.className==='note'?'s':(e.className==='big'?'big':'p')),t:e.textContent});}
 return out;}
function fname(ext){return '八字健康_'+last.pillars.join('')+'.'+ext;}
function save(blob,name){if(window.navigator&&navigator.msSaveBlob)return navigator.msSaveBlob(blob,name);var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(u);},4000);}
function rasterGlyph(cp){try{var ch=String.fromCodePoint(cp),N=96,font=N+'px "PingFang TC","Noto Serif CJK TC","Noto Sans TC","PMingLiU",serif';var c=document.createElement('canvas'),g=c.getContext('2d');g.font=font;var adv=Math.max(0.25,Math.min(1.6,g.measureText(ch).width/N)),W=Math.ceil(adv*N),Hh=Math.ceil(1.2*N);c.width=W;c.height=Hh;g=c.getContext('2d');g.font=font;g.fillStyle='#000';g.textBaseline='alphabetic';g.fillText(ch,0,N);var px=g.getImageData(0,0,W,Hh).data,rb=Math.ceil(W/8),bits=new Uint8Array(rb*Hh),ink=0;for(var y=0;y<Hh;y++)for(var x=0;x<W;x++)if(px[(y*W+x)*4+3]>110){bits[y*rb+(x>>3)]|=0x80>>(x&7);ink++;}return ink?{w:W,h:Hh,bits:bits,adv:adv}:null;}catch(e){return null;}}
var FONTP=null;
function font(){if(!FONTP)FONTP=fetch('fonts/tb-serif-tc.woff').then(function(r){if(!r.ok)throw new Error('字型載入失敗');return r.arrayBuffer();}).then(function(b){return TBX.loadFont(b);});FONTP['catch'](function(){FONTP=null;});return FONTP;}
function buildPdf(F,B,title){var d=new TBX.Doc(F,{raster:typeof document!=='undefined'?rasterGlyph:null}),ML=46,CW=d.pw-92,BOT=d.ph-50,y=50;d.newPage();
 function para(runs,lf,ind){ind=ind||0;var L=d.lay(runs,CW-ind,lf||1.5);for(var i=0;i<L.lines.length;i++){var ln=L.lines[i];if(y+ln.lh>BOT){d.newPage();y=50;}y=d.draw({lines:[ln],runs:L.runs},ML+ind,y,CW-ind);}}
 para([{t:title,s:18,b:1}]);y+=4;
 B.forEach(function(b){if(b.k==='h'){y+=6;para([{t:b.t,s:13,b:1,c:'7a2a18'}]);}
  else if(b.k==='s')para([{t:b.t,s:8,c:'8a6d3b'}],1.4);
  else if(b.k==='big')para([{t:b.t,s:16,b:1}]);
  else if(b.k==='table'){var n=b.rows[0].length,cw=CW/n;b.rows.forEach(function(r,ri){var Ls=r.map(function(t){return d.lay([{t:t,s:9.5,b:ri===0?1:0}],cw-6,1.4);}),h=0;Ls.forEach(function(L){h=Math.max(h,L.h);});h+=6;if(y+h>BOT){d.newPage();y=50;}
   Ls.forEach(function(L,j){d.rect(ML+j*cw,y,cw,h,ri===0?'f3ece2':null,'ccc4b8',0.5);d.draw(L,ML+j*cw+3,y+3,cw-6);});y+=h;});y+=4;}
  else para([{t:b.t,s:10.5}]);});
 return d.finish({title:title,now:new Date()});}
function crc(a){var c,t=[],x=-1,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}for(n=0;n<a.length;n++)x=(x>>>8)^t[(x^a[n])&255];return(x^-1)>>>0;}
function u8(s){return TBX&&typeof TextEncoder!=='undefined'?new TextEncoder().encode(s):null;}
function zip(files){var parts=[],cd=[],off=0;function w16(v){return[v&255,v>>8&255];}function w32(v){return[v&255,v>>8&255,v>>16&255,v>>>24&255];}
 files.forEach(function(f){var nm=u8(f.name),d=f.data,c=crc(d),h=[0x50,0x4b,3,4].concat(w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0));
  parts.push(new Uint8Array(h),nm,d);cd.push(new Uint8Array([0x50,0x4b,1,2].concat(w16(20),w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0),w16(0),w16(0),w16(0),w32(0),w32(off))),nm);off+=h.length+nm.length+d.length;});
 var l=0;cd.forEach(function(a){l+=a.length;});return parts.concat(cd,[new Uint8Array([0x50,0x4b,5,6].concat(w16(0),w16(0),w16(files.length),w16(files.length),w32(l),w32(off),w16(0)))]);}
function xe(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function wp(t,o){o=o||{};return '<w:p><w:r><w:rPr><w:rFonts w:eastAsia="PMingLiU"/>'+(o.b?'<w:b/>':'')+(o.c?'<w:color w:val="'+o.c+'"/>':'')+'<w:sz w:val="'+(o.sz||22)+'"/></w:rPr><w:t xml:space="preserve">'+xe(t)+'</w:t></w:r></w:p>';}
function buildDocx(B,title){var x=[wp(title,{b:1,sz:32})];B.forEach(function(b){if(b.k==='h')x.push(wp(b.t,{b:1,sz:26,c:'7A2A18'}));else if(b.k==='s')x.push(wp(b.t,{sz:16,c:'8A6D3B'}));else if(b.k==='big')x.push(wp(b.t,{b:1,sz:30}));
 else if(b.k==='table'){var t='<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>';b.rows.forEach(function(r,ri){t+='<w:tr>'+r.map(function(c){return '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>'+wp(c,{b:ri===0,sz:20})+'</w:tc>';}).join('')+'</w:tr>';});x.push(t+'</w:tbl>',wp(''));}
 else x.push(wp(b.t));});
 var doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+x.join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
 var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 return new Blob(zip([{name:'[Content_Types].xml',data:u8(ct)},{name:'_rels/.rels',data:u8(rels)},{name:'word/document.xml',data:u8(doc)}]),{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});}
function title(){return '八字健康疾病參考　'+last.gender+'造 '+last.pillars.join(' ');}
$('pdf').onclick=function(){$('emsg').textContent='產生 PDF 中…';font().then(function(F){return buildPdf(F,blocks(),title());}).then(function(bytes){save(new Blob([bytes],{type:'application/pdf'}),fname('pdf'));$('emsg').textContent='PDF 已產生';},function(e){$('emsg').textContent='PDF 失敗：'+(e&&e.message||e)+'（需經 http(s) 開啟以載入字型）';});};
$('doc').onclick=function(){save(buildDocx(blocks(),title()),fname('docx'));$('emsg').textContent='Word 已產生';};
window.__HX={blocks:blocks,buildPdf:buildPdf,buildDocx:buildDocx,font:font};
/* 自我測試 */
if(/[?&]selftest=1/.test(location.search)){var T=H.selftest(D);$('st').textContent='【自我測試】'+(T.ok?'全部通過':'有失敗')+'\n'+T.lines.join('\n');setP(H.SAMPLE.pillars);$('go').onclick();}
})();
