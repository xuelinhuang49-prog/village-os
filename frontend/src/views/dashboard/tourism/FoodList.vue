<template>
<div style="padding:14px 18px">
<div class="tbanner" style="border-left-color:#22B573;color:#22B573">🍽 美食推荐 · 品味乡村特色<span style="font-size:10px;color:#66788A;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
<span style="position:relative;display:inline-flex;align-items:center"><input v-model="filterText" placeholder="🔍 搜索餐馆、菜品..." style="padding:6px 30px 6px 12px;border-radius:8px;border:1px solid #E3EAF0;background:rgba(34,181,115,.06);color:#475867;font-size:12px;width:240px;font-family:inherit;outline:none"><span v-if="filterText" @click="filterText=''" style="position:absolute;right:6px;cursor:pointer;color:#66788A;font-size:14px;line-height:1" title="清空">×</span></span>
<div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in cats" :key="c.v" :class="cat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="cat=c.v">{{c.l}}<span v-if="c.v" style="font-size:9px;opacity:.7;margin-left:2px">({{foods.filter(f=>f.type===c.v).length}})</span></button></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="f in filteredList" :key="f.id" class="spot-card" @click="openDetail(f)">
<div class="spot-cover" :style="{background:foodCover()}"><div class="spot-cover-status" style="background:rgba(34,181,115,0.70)">营业中</div></div>
<div style="padding:12px 14px 14px;display:flex;flex-direction:column;flex:1"><div class="spot-card-name">{{f.name}}</div><div class="spot-tag" style="color:#F2A62B;border-color:#F2A62B;margin-bottom:4px;display:inline-block;width:fit-content">{{f.type}}</div><div class="spot-card-rating">⭐ {{f.rating}} <span style="color:#66788A;font-weight:400">· ¥{{f.pricePer}}/人</span></div><div class="spot-card-desc">{{(f.specialDishes||[]).slice(0,3).join('、')}}</div><div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#66788A"><span>📍 {{f.address||'中堰村'}}</span></div><div style="display:flex;gap:4px;margin-top:auto"><button class="btn btn-p btn-s" @click.stop="openDetail(f)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+(f.address||'中堰村'))">🗺️ 导航</button><button class="btn btn-o btn-s" @click.stop="toast('链接已复制')">📤</button><button class="btn btn-o btn-s" style="font-size:13px;padding:2px 6px" @click.stop="f._fav=!f._fav;toast(f._fav?'已收藏':'已取消')">{{f._fav?'❤️':'♡'}}</button></div></div>
</div>
</div>
<FoodDrawer :open="drawerOpen" :data="detailData" @close="drawerOpen=false" />
</div>
</template>

<script setup>
import {ref,computed} from 'vue'
import FoodDrawer from './FoodDrawer.vue'
const foods=[{id:1,name:'中堰农家乐',type:'农家菜',address:'中堰村中心',villageName:'中堰村',desc:'主打土灶炖鸡和蜂蜜烤鸡，食材均来自本村产业园。',pricePer:'68',phone:'139****6789',openTime:'10:00-21:00',specialDishes:['蜂蜜烤鸡','土灶炖鸡','蜂蜜李子','农家豆腐'],facilities:['停车','包厢','可团餐'],rating:'4.8',status:'开放',visitors:5600},{id:2,name:'李子农庄',type:'采摘体验',address:'中堰村产业园东区',villageName:'中堰村',desc:'集采摘和农家餐饮于一体，可体验蜂糖李采摘。',pricePer:'88',phone:'138****8901',openTime:'08:00-18:00',specialDishes:['蜂糖李鲜果','李子果酱','农家小炒'],facilities:['停车','儿童座椅'],rating:'4.6',status:'开放',visitors:3800},{id:3,name:'蜂蜜主题餐厅',type:'特色小吃',address:'中堰村产业园南区',villageName:'中堰村',desc:'以蜂蜜为主题的特色餐厅，蜂蜜系列甜品和饮品。',pricePer:'45',phone:'137****2345',openTime:'09:00-20:00',specialDishes:['蜂蜜蛋糕','蜂蜜柚子茶','蜂糖李冰沙'],facilities:['停车','WiFi'],rating:'4.9',status:'开放',visitors:7200},{id:4,name:'荷塘渔家',type:'农家菜',address:'中堰村北区',villageName:'中堰村',desc:'主打澳洲淡水龙虾和荷花鱼，可体验垂钓后现场加工。',pricePer:'98',phone:'136****3456',openTime:'11:00-22:00',specialDishes:['清蒸澳洲龙虾','荷花鱼汤','荷叶蒸鸡'],facilities:['停车','包厢','可团餐','儿童座椅'],rating:'4.7',status:'开放',visitors:4100}]
const filterText=ref(''),cat=ref('')
const cats=[{v:'',l:'全部'},{v:'农家菜',l:'农家菜'},{v:'特色小吃',l:'特色小吃'},{v:'采摘体验',l:'采摘体验'},{v:'时令美食',l:'时令美食'}]
const filteredList=computed(()=>{let l=foods;const f=filterText.value.toLowerCase();if(f)l=l.filter(x=>x.name.toLowerCase().includes(f)||(x.desc||'').toLowerCase().includes(f));if(cat.value)l=l.filter(x=>x.type===cat.value);return l})
const drawerOpen=ref(false),detailData=ref(null)
function openDetail(f){detailData.value=f;drawerOpen.value=true}
function toast(m){}
// 美食封面：内嵌 SVG「农家餐桌」插画（无外网依赖）
const _foodSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0b0"/><stop offset="1" stop-color="#f6e7cf"/></linearGradient></defs><rect width="800" height="500" fill="url(#bg)"/><circle cx="150" cy="110" r="44" fill="#ffe08a" opacity=".9"/><rect y="352" width="800" height="148" fill="#c89a6a"/><rect y="344" width="800" height="12" fill="#a8794c"/><ellipse cx="200" cy="402" rx="72" ry="18" fill="#8a6a48" opacity=".45"/><circle cx="200" cy="392" r="56" fill="#fff"/><circle cx="200" cy="392" r="42" fill="#e05a4a"/><ellipse cx="430" cy="410" rx="68" ry="17" fill="#8a6a48" opacity=".45"/><circle cx="430" cy="400" r="52" fill="#fff"/><circle cx="430" cy="400" r="38" fill="#4fa35a"/><ellipse cx="640" cy="406" rx="62" ry="16" fill="#8a6a48" opacity=".45"/><path d="M580 398 q60 62 120 0 z" fill="#e8d8b8"/><ellipse cx="640" cy="396" rx="42" ry="12" fill="#f2a62b"/><path d="M622 336 q8 -18 0 -34 q-8 -18 0 -34" stroke="#fff" stroke-width="4" fill="none" opacity=".55"/><path d="M654 340 q8 -18 0 -34 q-8 -18 0 -34" stroke="#fff" stroke-width="4" fill="none" opacity=".45"/></svg>`
function foodCover(){ return 'url("data:image/svg+xml,' + encodeURIComponent(_foodSvg) + '") center/cover' }
</script>

<style scoped>
.spot-card{background:#FFFFFF;border:1px solid #E3EAF0;border-radius:10px;overflow:hidden;cursor:pointer;transition:.2s;display:flex;flex-direction:column}
.spot-card:hover{border-color:rgba(14,165,233,.95);transform:translateY(-2px)}
.spot-cover{height:220px;position:relative;display:flex;align-items:center;justify-content:center;border-radius:10px 10px 0 0;overflow:hidden}
.spot-cover-icon{font-size:56px;opacity:.5}
.spot-cover-status{position:absolute;bottom:8px;right:8px;font-size:10px;padding:3px 10px;border-radius:10px;color:#fff}
.spot-card-name{font-size:15px;font-weight:700;color:#1F2D3D;margin-bottom:2px}
.spot-tag{display:inline-block;font-size:9px;padding:1px 8px;border-radius:10px;border:1px solid;font-weight:500}
.spot-card-rating{font-size:10px;color:#F2A62B;font-weight:600;margin-bottom:6px}
.spot-card-desc{font-size:11px;color:#66788A;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:4px}
.tbanner{font-size:13px;font-weight:700;padding:8px 12px;border-radius:6px;background:rgba(34,181,115,.08);margin-bottom:12px}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:inherit}
.btn-p{background:linear-gradient(135deg,#22B573,#1BA366);color:#fff;box-shadow:0 2px 8px rgba(34,181,115,.2)}
.btn-o{background:transparent;border:1px solid rgba(14,165,233,.28);color:#22B573}
.btn-s{padding:3px 9px;font-size:10px}
</style>
