<template>
<div class="drawer-overlay" :class="{on:open}" @click="$emit('close')"></div>
<div class="drawer" :class="{on:open}">
<div class="drawer-hd"><h3>🍽 美食详情</h3><button class="drawer-close" @click="$emit('close')">✕</button></div>
<div class="drawer-bd" v-if="data">
<div class="spot-cover" :style="{background:foodCover(),height:'120px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',marginBottom:'10px'}"></div>
<div style="text-align:center;padding:14px 0 6px">
<div style="font-size:17px;font-weight:700;color:#1F2D3D">{{data.name}}</div>
<div style="color:#F2A62B;font-size:12px;margin-top:4px">{{stars}} <span style="color:#475867;font-weight:500">{{data.rating}}</span></div>
<div style="margin-top:2px"><span class="stag" style="color:#F2A62B;border-color:#F2A62B">{{data.type}}</span><span style="font-size:10px;color:#22B573;margin-left:6px">· 营业中</span></div>
<div style="font-size:10px;color:#66788A;margin-top:6px">{{(data.specialDishes||[]).slice(0,3).join(' · ')}}</div>
</div>
<div class="sgrid">
<div class="sitem"><div class="sicon">💰</div><div><div class="ssub">人均消费</div><div class="slab" style="color:#22B573">¥{{data.pricePer}}/人</div></div></div>
<div class="sitem"><div class="sicon">🕒</div><div><div class="ssub">营业时间</div><div class="slab">{{data.openTime||'--'}}</div></div></div>
<div class="sitem"><div class="sicon">📍</div><div><div class="ssub">所在位置</div><div class="slab">{{data.address||'中堰村'}}</div></div></div>
<div class="sitem"><div class="sicon">📞</div><div><div class="ssub">联系电话</div><div class="slab" style="color:#22B573;cursor:pointer" @click="showPhone=!showPhone">{{showPhone?(data.phone||'--'):'电话咨询'}}</div></div></div>
</div>
<div style="font-size:12px;font-weight:700;color:#22B573;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(34,181,115,.12)">🍲 推荐菜</div>
<div style="display:flex;gap:6px;flex-wrap:wrap"><span v-for="d in data.specialDishes" :key="d" class="stag2">{{d}}</span></div>
<div v-if="data.desc" style="margin-top:10px;background:#F8FAFB;border-radius:8px;padding:12px 14px"><div class="ssub" style="margin-bottom:4px">📖 商家简介</div><div style="color:#475867;font-size:11px;line-height:1.8">{{data.desc}}</div></div>
<div style="font-size:12px;font-weight:700;color:#22B573;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(34,181,115,.12)">🛎 配套服务</div>
<div v-if="data.facilities&&data.facilities.length" style="display:flex;gap:8px;flex-wrap:wrap;padding:4px 0 8px"><span v-for="x in data.facilities" :key="x" class="stag2">{{x==='停车'?'🅿':x==='包厢'?'🚪':x==='可团餐'?'👨‍👩‍👧':x==='WiFi'?'📶':x==='儿童座椅'?'👶':'✅'}} {{x}}</span></div>
<div style="text-align:center;font-size:11px;color:#66788A;padding:4px 0 8px">👁 已有 {{(data.visitors||0).toLocaleString()}} 人浏览</div>
<div style="display:flex;gap:8px;padding-top:8px;border-top:1px solid #E3EAF0;flex-wrap:wrap">
<button class="btn btn-p" style="padding:6px 16px;font-size:11px" @click="navTo">📍 立即导航</button>
<button class="btn btn-o btn-s" @click="callPhone">📞 电话咨询</button>
<button class="btn btn-o btn-s" style="color:#E05252;border-color:rgba(224,82,82,0.30)" @click="fav=!fav">{{fav?'❤️':'♡'}} 收藏</button>
<button class="btn btn-o btn-s" @click="shareIt">📤 分享</button>
<button class="btn btn-o btn-s" style="color:#66788A" @click="$emit('close')">返回</button>
</div>
</div>
</div>
</template>

<script setup>
import {ref,computed} from 'vue'
const props=defineProps({open:Boolean,data:Object})
defineEmits(['close'])
const showPhone=ref(false),fav=ref(false)
const stars=computed(()=>{const n=Math.round(parseFloat(props.data?.rating)||0);return '★'.repeat(n)+'☆'.repeat(5-n)})
function navTo(){alert('导航到：'+(props.data?.address||'中堰村'))}
function callPhone(){alert('准备拨号：'+(props.data?.phone||''))}
function shareIt(){alert('链接已复制')}
// 美食封面：内嵌 SVG「农家餐桌」插画（无外网依赖）
const _foodSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0b0"/><stop offset="1" stop-color="#f6e7cf"/></linearGradient></defs><rect width="800" height="500" fill="url(#bg)"/><circle cx="150" cy="110" r="44" fill="#ffe08a" opacity=".9"/><rect y="352" width="800" height="148" fill="#c89a6a"/><rect y="344" width="800" height="12" fill="#a8794c"/><ellipse cx="200" cy="402" rx="72" ry="18" fill="#8a6a48" opacity=".45"/><circle cx="200" cy="392" r="56" fill="#fff"/><circle cx="200" cy="392" r="42" fill="#e05a4a"/><ellipse cx="430" cy="410" rx="68" ry="17" fill="#8a6a48" opacity=".45"/><circle cx="430" cy="400" r="52" fill="#fff"/><circle cx="430" cy="400" r="38" fill="#4fa35a"/><ellipse cx="640" cy="406" rx="62" ry="16" fill="#8a6a48" opacity=".45"/><path d="M580 398 q60 62 120 0 z" fill="#e8d8b8"/><ellipse cx="640" cy="396" rx="42" ry="12" fill="#f2a62b"/><path d="M622 336 q8 -18 0 -34 q-8 -18 0 -34" stroke="#fff" stroke-width="4" fill="none" opacity=".55"/><path d="M654 340 q8 -18 0 -34 q-8 -18 0 -34" stroke="#fff" stroke-width="4" fill="none" opacity=".45"/></svg>`
function foodCover(){ return 'url("data:image/svg+xml,' + encodeURIComponent(_foodSvg) + '") center/cover' }
</script>

<style scoped>
.drawer-overlay{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s}
.drawer-overlay.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:460px;z-index:100;background:#FFFFFF;border-left:1px solid #E3EAF0;transform:translateX(100%);transition:transform .3s;display:flex;flex-direction:column}
.drawer.on{transform:translateX(0)}
.drawer-hd{padding:14px 18px;border-bottom:1px solid #E3EAF0;display:flex;justify-content:space-between;align-items:center}
.drawer-hd h3{font-size:14px;font-weight:700;color:#1F2D3D}
.drawer-close{width:28px;height:28px;border-radius:50%;border:1px solid #E3EAF0;background:#F0F3F8;color:#475867;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px}
.drawer-bd{flex:1;overflow-y:auto;padding:16px 18px}
.stag{display:inline-block;font-size:9px;padding:1px 8px;border-radius:10px;border:1px solid;font-weight:500}
.stag2{display:inline-block;padding:4px 10px;border-radius:9px;font-size:9px;font-weight:600;background:rgba(34,181,115,.12);color:#22B573}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.sitem{background:#F8FAFB;border-radius:8px;padding:10px;display:flex;align-items:center;gap:8px}
.sicon{font-size:18px;flex-shrink:0}
.ssub{font-size:9px;color:#66788A;margin-bottom:2px}
.slab{font-size:13px;color:#475867;font-weight:600}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:inherit}
.btn-p{background:linear-gradient(135deg,#22B573,#1BA366);color:#fff;box-shadow:0 2px 8px rgba(34,181,115,.2)}
.btn-o{background:transparent;border:1px solid rgba(14,165,233,.28);color:#22B573}
.btn-s{padding:3px 9px;font-size:10px}
</style>
