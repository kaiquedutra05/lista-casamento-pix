const PIX_KEY = "kaiquedutramartinez@hotmail.com";
const MERCHANT_NAME = "KAIQUE MARTINEZ";
const MERCHANT_CITY = "SAO PAULO";
const GIFTS = [
  { id: "tv55", name: "Smart TV 55\" 4K", price: 3299.90, image: "https://picsum.photos/seed/tv55/600/400" },
  { id: "geladeira", name: "Geladeira Frost Free 400L", price: 2599.00, image: "https://picsum.photos/seed/fridge/600/400" },
  { id: "maquina", name: "Máquina de Lavar 12kg", price: 2199.00, image: "https://picsum.photos/seed/wash/600/400" },
  { id: "liquidificador", name: "Liquidificador Potente", price: 229.90, image: "https://picsum.photos/seed/blender/600/400" },
  { id: "aspirador", name: "Aspirador de Pó", price: 399.90, image: "https://picsum.photos/seed/vacuum/600/400" },
  { id: "jogoCama", name: "Jogo de Cama Casal 400 fios", price: 349.00, image: "https://picsum.photos/seed/bed/600/400" },
  { id: "panelaPressao", name: "Panela de Pressão 6L", price: 199.00, image: "https://picsum.photos/seed/panela/600/400" },
  { id: "faqueiro", name: "Faqueiro Inox 24 peças", price: 159.00, image: "https://picsum.photos/seed/knife/600/400" },
  { id: "cafeteira", name: "Cafeteira Elétrica", price: 279.90, image: "https://picsum.photos/seed/coffee/600/400" },
  { id: "microondas", name: "Micro-ondas 32L", price: 799.00, image: "https://picsum.photos/seed/micro/600/400" }
];
function formatBRL(value){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);}function pad2(n){return n.toString().padStart(2,'0');}
function tlv(id,value){const len=value.length;if(len>99)throw new Error(`Valor muito longo para o campo ${id}: ${len}`);return id+pad2(len)+value;}
function crc16(str){let crc=0xFFFF;for(let i=0;i<str.length;i++){crc^=(str.charCodeAt(i)<<8);for(let j=0;j<8;j++){if((crc&0x8000)!==0){crc=(crc<<1)^0x1021;}else{crc=(crc<<1);}crc&=0xFFFF;}}return crc.toString(16).toUpperCase().padStart(4,'0');}
function generatePixPayload({key,name,city,amount,txid,description}){const payload00=tlv('00','01');const payload01=tlv('01','12');const gui=tlv('00','BR.GOV.BCB.PIX');const chave=tlv('01',key);const infoAdicional=description?tlv('02',description):'';const mai26=tlv('26',gui+chave+infoAdicional);const mcc=tlv('52','0000');const curr=tlv('53','986');const amt=tlv('54',Number(amount).toFixed(2));const ccode=tlv('58','BR');const mname=tlv('59',name.toUpperCase());const mcity=tlv('60',city.toUpperCase());const adtxid=tlv('05',txid);const add62=tlv('62',adtxid);const partial=payload00+payload01+mai26+mcc+curr+amt+ccode+mname+mcity+add62;const crc=crc16(partial+'6304');const payload=partial+tlv('63',crc);return payload;}
function buildCards(){const grid=document.getElementById('gift-list');GIFTS.forEach(g=>{const card=document.createElement('article');card.className='card';card.innerHTML=`<img src="${g.image}" alt="${g.name}"><div class="body"><div class="title">${g.name}</div><div class="price">${formatBRL(g.price)}</div><div class="actions"><button class="btn" onclick="openModal('${g.id}')">Presentear</button></div></div>`;grid.appendChild(card);});}
function openModal(id){const gift=GIFTS.find(x=>x.id===id);if(!gift)return;document.getElementById('giftImage').src=gift.image;document.getElementById('giftName').textContent=gift.name;document.getElementById('giftPrice').textContent=formatBRL(gift.price);const txid=`CASAMENTO-${id}`.slice(0,25);const payload=generatePixPayload({key:PIX_KEY,name:MERCHANT_NAME,city:MERCHANT_CITY,amount:gift.price,description:`Presente: ${gift.name}`,txid});const pixCodeEl=document.getElementById('pixCode');pixCodeEl.value=payload;const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payload)}`;const qrImg=document.getElementById('qrImage');qrImg.src=qrUrl;const share=document.getElementById('shareBtn');const wurl=`https://wa.me/?text=${encodeURIComponent('PIX Copia e Cola - '+formatBRL(gift.price)+'
'+payload)}`;share.href=wurl;share.textContent='Enviar via WhatsApp';const modal=document.getElementById('modal');modal.setAttribute('aria-hidden','false');}
function closeModal(){const modal=document.getElementById('modal');modal.setAttribute('aria-hidden','true');}
function copyPix(){const pixCodeEl=document.getElementById('pixCode');pixCodeEl.select();pixCodeEl.setSelectionRange(0,pixCodeEl.value.length);const ok=document.execCommand('copy');const btn=document.getElementById('copyBtn');btn.textContent=ok?'Copiado!':'Copiar código';setTimeout(()=>btn.textContent='Copiar código',1500);}buildCards();
