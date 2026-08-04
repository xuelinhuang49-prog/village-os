<template>
<div class="drawer-overlay" :class="{on:open}" @click="$emit('close')"></div>
<div class="drawer" :class="{on:open}">
<div class="drawer-hd"><h3>🍽 美食详情</h3><button class="drawer-close" @click="$emit('close')">✕</button></div>
<div class="drawer-bd" v-if="data">
<div class="spot-cover" style="background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(10,61,92,.6));height:100px;display:flex;align-items:center;justify-content:center;border-radius:8px;margin-bottom:10px"><div style="font-size:48px;opacity:.5">🍽</div></div>
<div style="text-align:center;padding:14px 0 6px">
<div style="font-size:17px;font-weight:700;color:#fff">{{data.name}}</div>
<div style="color:#F5B83D;font-size:12px;margin-top:4px">{{stars}} <span style="color:#B7D3E8;font-weight:500">{{data.rating}}</span></div>
<div style="margin-top:4px"><span class="stag" style="color:#F5B83D;border-color:#F5B83D">{{data.type}}</span><span style="font-size:10px;color:#28C76F;margin-left:6px">· 营业中</span></div>
</div>
<div class="sgrid">
<div class="sitem"><div class="sicon">💰</div><div><div class="ssub">人均消费</div><div class="slab" style="color:#28C76F">¥{{data.pricePer}}/人</div></div></div>
<div class="sitem"><div class="sicon">🕒</div><div><div class="ssub">营业时间</div><div class="slab">{{data.openTime||'--'}}</div></div></div>
<div class="sitem"><div class="sicon">📍</div><div><div class="ssub">所在位置</div><div class="slab">{{data.address||'中堰村'}}</div></div></div>
<div class="sitem"><div class="sicon">📞</div><div><div class="ssub">联系电话</div><div class="slab" style="color:#28C76F;cursor:pointer" @click="showPhone=!showPhone">{{showPhone?(data.phone||'--'):'点击查看'}}</div></div></div>
</div>
<div style="font-size:12px;font-weight:700;color:#28C76F;margin:12px 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(40,199,111,.1)">🍲 推荐菜</div>
<div style="display:flex;gap:6px;flex-wrap:wrap"><span v-for="d in data.specialDishes" :key="d" class="stag2">{{d}}</span></div>
<div v-if="data.desc" style="margin-top:10px;background:rgba(10,36,68,.55);border-radius:8px;padding:12px"><div class="ssub" style="margin-bottom:6px">📝 店铺介绍</div><div style="color:#8FA8C0;font-size:11px;line-height:1.7">{{data.desc}}</div></div>
<div v-if="data.facilities&&data.facilities.length" style="display:flex;gap:10px;flex-wrap:wrap;padding:8px 0"><span v-for="x in data.facilities" :key="x" class="stag2">{{x==='停车'?'🅿':x==='包厢'?'🚪':x==='可团餐'?'👨‍👩‍👧':x==='WiFi'?'📶':x==='儿童座椅'?'👶':'✅'}} {{x}}</span></div>
<div style="text-align:center;font-size:9px;color:rgba(111,145,168,.5);margin-top:8px">累计浏览 {{(data.visitors||0).toLocaleString()}} 次</div>
<div style="display:flex;gap:8px;padding-top:10px;border-top:1px solid rgba(40,199,111,.08);margin-top:10px;flex-wrap:wrap">
<button class="btn btn-p" style="padding:6px 16px;font-size:11px" @click="navTo">📍 立即导航</button>
<button class="btn btn-o btn-s" @click="callPhone">📞 电话咨询</button>
<button class="btn btn-o btn-s" style="color:#E74C3C;border-color:rgba(231,76,60,.3)" @click="fav=!fav">{{fav?'❤️':'♡'}} 收藏</button>
<button class="btn btn-o btn-s" @click="shareIt">📤 分享</button>
<button class="btn btn-o btn-s" style="color:#6F91A8" @click="$emit('close')">关闭</button>
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
</script>

<style scoped>
.drawer-overlay{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s}
.drawer-overlay.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:460px;z-index:100;background:rgba(6,20,44,.98);border-left:1px solid rgba(40,199,111,.1);transform:translateX(100%);transition:transform .3s;display:flex;flex-direction:column}
.drawer.on{transform:translateX(0)}
.drawer-hd{padding:14px 18px;border-bottom:1px solid rgba(40,199,111,.1);display:flex;justify-content:space-between;align-items:center}
.drawer-hd h3{font-size:14px;font-weight:700;color:#fff}
.drawer-close{width:28px;height:28px;border-radius:50%;border:1px solid rgba(40,199,111,.1);background:rgba(10,60,130,.2);color:#B7D3E8;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px}
.drawer-bd{flex:1;overflow-y:auto;padding:16px 18px}
.stag{display:inline-block;font-size:9px;padding:1px 8px;border-radius:10px;border:1px solid;font-weight:500}
.stag2{display:inline-block;padding:4px 10px;border-radius:9px;font-size:9px;font-weight:600;background:rgba(16,214,160,.15);color:#28C76F}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.sitem{background:rgba(10,36,68,.55);border-radius:8px;padding:10px;display:flex;align-items:center;gap:8px}
.sicon{font-size:18px;flex-shrink:0}
.ssub{font-size:9px;color:#6F91A8;margin-bottom:2px}
.slab{font-size:13px;color:#B7D3E8;font-weight:600}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:inherit}
.btn-p{background:linear-gradient(135deg,#39D98A,#28C76F);color:#fff;box-shadow:0 2px 8px rgba(57,217,138,.2)}
.btn-o{background:transparent;border:1px solid rgba(14,165,233,.28);color:#28C76F}
.btn-s{padding:3px 9px;font-size:10px}
</style>
