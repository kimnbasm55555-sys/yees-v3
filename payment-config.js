/*
  YEES payment settings
  ---------------------------------------------------------------
  mode: 'demo'  → payment window is simulated, nothing is charged.
  mode: 'live'  → real payment through PortOne (포트원) V2.
                  Fill in storeId and the channel keys you receive after
                  the PG contract (YEES business registration), then
                  change mode to 'live'.

  Recommended channels
   - card    : overseas cards in USD   (KG이니시스 해외카드 or 엑심베이 Eximbay)
   - paypal  : PayPal in USD           (PayPal via PortOne)
   - krcard  : Korean cards / easy pay (KG이니시스 or 토스페이먼츠, KRW)

  Fees below are SAMPLE amounts for the preview. Replace them with the
  confirmed 2027 registration fees.
*/
window.YEES_PAY = {
  mode: 'demo',
  storeId: '',                 // e.g. 'store-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  channelKeys: {
    card:   '',                // overseas card channel key
    paypal: '',                // PayPal channel key
    krcard: ''                 // domestic card channel key
  },
  fees: {                      // SAMPLE — to be confirmed
    dissector:    { USD: 1200, KRW: 1500000 },
    nondissector: { USD: 600,  KRW: 750000 },
    observer:     { USD: 150,  KRW: 200000 }
  },
  dinner: { USD: 0, KRW: 0 },  // course dinner included
  orderName: '20th YEES & 4th ITFA 2027 Registration'
};
