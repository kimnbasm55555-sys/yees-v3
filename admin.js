/* YEES admin preview — reads registrations saved in this browser */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var CAT = { dissector:'Dissector', nondissector:'Non-dissector', observer:'Observer' };
  var PAY = { card:'Overseas card', paypal:'PayPal', krcard:'Korean card', wire:'Wire transfer' };
  function rows(){ try{ return JSON.parse(localStorage.getItem('yees-regs')||'[]'); }catch(e){ return []; } }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function money(r){ return r.currency==='KRW' ? Number(r.amount).toLocaleString('ko-KR')+' KRW' : 'USD '+Number(r.amount).toLocaleString('en-US'); }
  function draw(){
    var a = rows(), paid = a.filter(function(r){return r.status==='Paid';});
    var usd = paid.filter(function(r){return r.currency==='USD';}).reduce(function(s,r){return s+r.amount;},0);
    var krw = paid.filter(function(r){return r.currency==='KRW';}).reduce(function(s,r){return s+r.amount;},0);
    var dis = a.filter(function(r){return r.cat==='dissector';}).length;
    $('kpi').innerHTML = '<div><b>'+a.length+'</b><span>Registrations</span></div><div><b>'+paid.length+'</b><span>Paid</span></div><div><b>'+dis+'</b><span>Dissectors</span></div><div><b>USD '+usd.toLocaleString('en-US')+'</b><span>+ '+krw.toLocaleString('ko-KR')+' KRW</span></div>';
    var tb = $('tbl').querySelector('tbody');
    tb.innerHTML = a.length ? a.slice().reverse().map(function(r){
      return '<tr><td>'+esc(r.no)+'</td><td>'+esc(r.date.slice(0,10))+'</td><td>'+esc(r.title+' '+r.first+' '+r.last)+'<br><span class="small">'+esc(r.email)+'</span></td><td>'+esc(r.country)+'</td><td>'+esc(r.aff)+'</td><td>'+CAT[r.cat]+'</td><td>'+money(r)+'</td><td>'+PAY[r.pay]+'</td><td><span class="st '+(r.status==='Paid'?'ok':'wait')+'">'+esc(r.status)+'</span></td></tr>';
    }).join('') : '<tr><td colspan="9" class="small">No registrations yet. Try the Online Registration page.</td></tr>';
  }
  $('login').addEventListener('submit', function(e){
    e.preventDefault();
    if($('pw').value === 'yees2027'){ $('login').hidden = true; $('board').hidden = false; draw(); }
    else $('lerr').hidden = false;
  });
  $('csv').addEventListener('click', function(){
    var a = rows(), head = ['no','date','title','first','last','email','phone','country','aff','pos','spec','cat','pay','currency','amount','status','dinner','grant','visa'];
    var csv = '﻿' + head.join(',') + '\n' + a.map(function(r){ return head.map(function(h){ return '"'+String(r[h]==null?'':r[h]).replace(/"/g,'""')+'"'; }).join(','); }).join('\n');
    var url = URL.createObjectURL(new Blob([csv],{type:'text/csv'})), l = document.createElement('a');
    l.href = url; l.download = 'yees-registrations.csv'; document.body.appendChild(l); l.click(); l.remove();
  });
  $('clear').addEventListener('click', function(){ try{ localStorage.removeItem('yees-regs'); }catch(e){} draw(); });
})();
