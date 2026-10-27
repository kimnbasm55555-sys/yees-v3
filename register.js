/* YEES online registration + payment (demo / PortOne V2 live) */
(function(){
  var C = window.YEES_PAY || {};
  var $ = function(id){ return document.getElementById(id); };
  var form = $('regForm'); if(!form) return;
  var KO = function(){ return document.documentElement.getAttribute('data-lang') === 'ko'; };
  var CATN = { dissector:['Dissector','해부 실습'], nondissector:['Non-dissector','비실습 참가'], observer:['Observer','참관'] };
  var PAYN = { card:['International credit card','해외 신용카드'], paypal:['PayPal','페이팔'], krcard:['Korean card / easy pay','국내 카드 / 간편결제'], wire:['Wire transfer','계좌이체'] };
  function val(name){ var r = form.querySelector('input[name="'+name+'"]:checked'); return r ? r.value : ''; }
  function cur(){ return val('pay') === 'krcard' ? 'KRW' : 'USD'; }
  function fmt(n,c){ return c === 'KRW' ? n.toLocaleString('ko-KR') + (KO() ? '원' : ' KRW') : 'USD ' + n.toLocaleString('en-US'); }
  function amount(){ var c = cur(), f = (C.fees||{})[val('cat')] || {USD:0,KRW:0}; return { cur:c, total:f[c] }; }

  function paintFees(){
    var c = cur();
    form.querySelectorAll('[data-fee]').forEach(function(el){ var f = (C.fees||{})[el.dataset.fee]; if(f) el.textContent = fmt(f[c], c); });
    var a = amount(), k = KO();
    $('summary').innerHTML =
      '<div><span>'+(k?'참가 구분':'Category')+'</span><b>'+CATN[val('cat')][k?1:0]+'</b></div>'+
      '<div><span>'+(k?'결제 방법':'Payment')+'</span><b>'+PAYN[val('pay')][k?1:0]+'</b></div>'+
      '<div class="tot"><span>'+(k?'결제 금액':'Total')+'</span><b>'+fmt(a.total,a.cur)+'</b></div>';
    $('payBtn').querySelectorAll('.l-en,.l-ko').forEach(function(x){});
  }
  form.addEventListener('change', paintFees);
  new MutationObserver(paintFees).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  paintFees();

  function regNo(){ var d = new Date(); return 'YEES27-' + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '-' + Math.random().toString(36).slice(2,6).toUpperCase(); }
  function save(rec){ try{ var a = JSON.parse(localStorage.getItem('yees-regs')||'[]'); a.push(rec); localStorage.setItem('yees-regs', JSON.stringify(a)); }catch(e){} }

  function data(){
    return { title:$('f_title').value, first:$('f_first').value.trim(), last:$('f_last').value.trim(), country:$('f_country').value,
      aff:$('f_aff').value.trim(), pos:$('f_pos').value, spec:$('f_spec').value, email:$('f_email').value.trim(), phone:$('f_phone').value.trim(),
      cat:val('cat'), pay:val('pay'), dinner:$('f_dinner').checked, grant:$('f_grant').checked, visa:$('f_visa').checked };
  }
  function check(d){
    var k = KO();
    if(!d.first || !d.last) return k ? '영문 이름과 성을 입력해 주세요.' : 'Please enter your first and last name.';
    if(!d.aff) return k ? '소속을 입력해 주세요.' : 'Please enter your affiliation.';
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return k ? '이메일 주소를 확인해 주세요.' : 'Please check your e-mail address.';
    if(!$('f_agree').checked) return k ? '취소·환불 규정에 동의해 주세요.' : 'Please agree to the cancellation and refund policy.';
    return '';
  }

  function finish(d, status, pid){
    var a = amount(), no = regNo(), k = KO();
    var rec = Object.assign({ no:no, date:new Date().toISOString(), amount:a.total, currency:a.cur, status:status, paymentId:pid||'' }, d);
    save(rec);
    form.hidden = true;
    var paid = status === 'Paid';
    $('done').innerHTML =
      '<p class="eyebrow">'+(paid?(k?'결제 완료':'Payment complete'):(k?'등록 접수':'Registration received'))+'</p>'+
      '<h2>'+(k?'등록해 주셔서 감사합니다.':'Thank you for registering.')+'</h2>'+
      '<table class="ov"><tr><th>'+(k?'등록번호':'Registration no.')+'</th><td><b>'+no+'</b></td></tr>'+
      '<tr><th>'+(k?'성명':'Name')+'</th><td>'+d.title+' '+d.first+' '+d.last+'</td></tr>'+
      '<tr><th>'+(k?'참가 구분':'Category')+'</th><td>'+CATN[d.cat][k?1:0]+'</td></tr>'+
      '<tr><th>'+(k?'금액':'Amount')+'</th><td>'+fmt(a.total,a.cur)+'</td></tr>'+
      '<tr><th>'+(k?'상태':'Status')+'</th><td>'+(paid?(k?'결제 완료':'Paid'):(k?'입금 대기 (계좌이체)':'Awaiting bank transfer'))+'</td></tr></table>'+
      '<p>'+(paid?(k?'확인 메일이 '+d.email+'(으)로 발송됩니다.':'A confirmation will be sent to '+d.email+'.'):(k?'등록 안내 페이지의 계좌로 송금한 뒤 송금 확인증을 yees@yees.or.kr로 보내 주세요.':'Please transfer the fee to the account on the How to Register page and e-mail the receipt to yees@yees.or.kr.'))+'</p>'+
      (C.mode==='demo'?'<p class="small">'+(k?'시연 모드: 실제 결제는 일어나지 않았습니다.':'Preview mode: no card was charged.')+'</p>':'')+
      '<div class="after"><a class="btn ghost" href="online-registration.html">'+(k?'새 등록':'New registration')+'</a><a class="btn ghost" href="index.html">'+(k?'홈으로':'Home')+'</a></div>';
    $('done').hidden = false; window.scrollTo({top:0,behavior:'smooth'});
  }

  /* demo payment window */
  function demoPay(d){
    var a = amount(), k = KO(), m = $('pgm'), b = $('pgmBody');
    var method = d.pay;
    var brand = method==='paypal' ? '<div class="pp">PayPal</div>' : method==='krcard' ? '<div class="brands"><span>신한</span><span>KB국민</span><span>삼성</span><span>현대</span><span>카카오페이</span><span>네이버페이</span></div>' : '<div class="brands"><span>VISA</span><span>Mastercard</span><span>JCB</span><span>AMEX</span><span>UnionPay</span></div>';
    b.innerHTML = '<p class="small">'+C.orderName+'</p><p class="amt">'+fmt(a.total,a.cur)+'</p>'+brand+
      (method==='paypal' ? '<p>'+(k?'페이팔 로그인 창이 여기에 열립니다.':'The PayPal login window opens here.')+'</p>' :
      '<label>'+(k?'카드 번호':'Card number')+'<input value="4242 4242 4242 4242" readonly></label><div class="fg2"><label>'+(k?'유효기간':'Expiry')+'<input value="12 / 29" readonly></label><label>CVC<input value="123" readonly></label></div>')+
      '<div class="after"><button class="btn" type="button" id="pgmOk">'+(k?'결제 승인 (시연)':'Approve payment (demo)')+'</button><button class="btn ghost" type="button" id="pgmNo">'+(k?'취소':'Cancel')+'</button></div>';
    m.hidden = false;
    $('pgmOk').onclick = function(){ m.hidden = true; finish(d,'Paid','demo-'+Date.now()); };
    $('pgmNo').onclick = function(){ m.hidden = true; };
  }

  /* live payment through PortOne V2 */
  function loadSdk(cb){ if(window.PortOne) return cb(); var s = document.createElement('script'); s.src = 'https://cdn.portone.io/v2/browser-sdk.js'; s.onload = cb; document.head.appendChild(s); }
  function livePay(d){
    var a = amount(), key = (C.channelKeys||{})[d.pay];
    if(!C.storeId || !key){ return showErr(KO()?'결제 설정이 아직 완료되지 않았습니다.':'Payment is not configured yet.'); }
    loadSdk(function(){
      var pid = 'yees27-' + Date.now();
      PortOne.requestPayment({
        storeId: C.storeId, channelKey: key, paymentId: pid, orderName: C.orderName,
        totalAmount: a.total, currency: a.cur === 'KRW' ? 'CURRENCY_KRW' : 'CURRENCY_USD',
        payMethod: d.pay === 'paypal' ? 'PAYPAL' : (d.pay === 'krcard' ? 'EASY_PAY' : 'CARD'),
        customer: { fullName: d.first + ' ' + d.last, email: d.email, phoneNumber: d.phone },
        locale: KO() ? 'KO_KR' : 'EN_US'
      }).then(function(r){
        if(r && r.code){ showErr(r.message || 'Payment failed.'); return; }
        /* The server must verify the payment with PortOne before it is confirmed (api/verify). */
        finish(d,'Paid',pid);
      });
    });
  }

  function showErr(msg){ var e = $('err'); e.textContent = msg; e.hidden = !msg; }
  form.addEventListener('submit', function(ev){
    ev.preventDefault(); var d = data(), msg = check(d); showErr(msg); if(msg) return;
    if(d.pay === 'wire') return finish(d,'Awaiting transfer');
    if(C.mode === 'live') livePay(d); else demoPay(d);
  });
})();
