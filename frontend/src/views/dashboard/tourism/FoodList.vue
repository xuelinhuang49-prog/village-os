<template>
<div style="padding:14px 18px">
<div class="tbanner" style="border-left-color:#28C76F;color:#28C76F">🍽 美食推荐 · 品味乡村特色<span style="font-size:10px;color:#6F91A8;font-weight:400;margin-left:8px">📍 当前村庄：中堰村</span></div>
<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
<span style="position:relative;display:inline-flex;align-items:center"><input v-model="filterText" placeholder="🔍 搜索餐馆、菜品..." style="padding:6px 30px 6px 12px;border-radius:8px;border:1px solid rgba(40,199,111,.1);background:rgba(57,217,138,.06);color:#B7D3E8;font-size:12px;width:240px;font-family:inherit;outline:none"><span v-if="filterText" @click="filterText=''" style="position:absolute;right:6px;cursor:pointer;color:#6F91A8;font-size:14px;line-height:1" title="清空">×</span></span>
<div style="display:flex;gap:4px;flex-wrap:wrap"><button v-for="c in cats" :key="c.v" :class="cat===c.v?'btn btn-p btn-s':'btn btn-o btn-s'" @click="cat=c.v">{{c.l}}<span v-if="c.v" style="font-size:9px;opacity:.7;margin-left:2px">({{foods.filter(f=>f.type===c.v).length}})</span></button></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
<div v-for="f in filteredList" :key="f.id" class="spot-card" @click="$emit('detail',f)">
<div class="spot-cover" style="background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(10,61,92,.6))"><div class="spot-cover-icon">🍽</div><div class="spot-cover-status" style="background:rgba(40,199,111,.7)">营业中</div></div>
<div style="padding:12px 14px 14px;display:flex;flex-direction:column;flex:1"><div class="spot-card-name">{{f.name}}</div><div class="spot-tag" style="color:#F5B83D;border-color:#F5B83D;margin-bottom:4px;display:inline-block;width:fit-content">{{f.type}}</div><div class="spot-card-rating">⭐ {{f.rating}} <span style="color:#6F91A8;font-weight:400">· ¥{{f.pricePer}}/人</span></div><div class="spot-card-desc">{{(f.specialDishes||[]).slice(0,3).join('、')}}</div><div style="display:flex;gap:8px;margin:8px 0;font-size:10px;color:#6F91A8"><span>📍 {{f.address||'中堰村'}}</span></div><div style="display:flex;gap:4px;margin-top:auto"><button class="btn btn-p btn-s" @click.stop="$emit('detail',f)">查看详情</button><button class="btn btn-o btn-s" @click.stop="toast('导航到：'+(f.address||'中堰村'))">🗺️ 导航</button><button class="btn btn-o btn-s" @click.stop="toast('链接已复制')">📤</button><button class="btn btn-o btn-s" style="font-size:13px;padding:2px 6px" @click.stop="f._fav=!f._fav;toast(f._fav?'已收藏':'已取消')">{{f._fav?'❤️':'♡'}}</button></div></div>
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
defineEmits(['detail'])
function toast(m){alert(m)}
</script>

<style scoped>
.spot-card{background:rgba(5,25,48,.96);border:1px solid rgba(190,214,234,.55);border-radius:10px;overflow:hidden;cursor:pointer;transition:.2s;display:flex;flex-direction:column}
.spot-card:hover{border-color:rgba(72,193,255,.95);transform:translateY(-2px)}
.spot-cover{height:220px;position:relative;display:flex;align-items:center;justify-content:center;border-radius:10px 10px 0 0;overflow:hidden}
.spot-cover-icon{font-size:56px;opacity:.5}
.spot-cover-status{position:absolute;bottom:8px;right:8px;font-size:10px;padding:3px 10px;border-radius:10px;color:#fff}
.spot-card-name{font-size:15px;font-weight:700;color:#fff;margin-bottom:2px}
.spot-tag{display:inline-block;font-size:9px;padding:1px 8px;border-radius:10px;border:1px solid;font-weight:500}
.spot-card-rating{font-size:10px;color:#F5B83D;font-weight:600;margin-bottom:6px}
.spot-card-desc{font-size:11px;color:#6F91A8;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:4px}
.tbanner{font-size:13px;font-weight:700;padding:8px 12px;border-radius:6px;background:rgba(40,199,111,.06);margin-bottom:12px}
.btn{display:inline-block;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:inherit}
.btn-p{background:linear-gradient(135deg,#39D98A,#28C76F);color:#fff;box-shadow:0 2px 8px rgba(57,217,138,.2)}
.btn-o{background:transparent;border:1px solid rgba(14,165,233,.28);color:#28C76F}
.btn-s{padding:3px 9px;font-size:10px}
</style>
