package com.village.os.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.entity.*;
import com.village.os.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminUserMapper adminUserMapper;
    private final FarmerMapper farmerMapper;
    private final LandMapper landMapper;
    private final CropMapper cropMapper;
    private final FarmingRecordMapper farmingRecordMapper;
    private final ProductMapper productMapper;
    private final OrderMapper orderMapper;
    private final BnbMapper bnbMapper;
    private final ScenicSpotMapper scenicSpotMapper;
    private final TrainingCourseMapper trainingCourseMapper;
    private final InsuranceMapper insuranceMapper;
    private final SubsidyMapper subsidyMapper;
    private final ElderMapper elderMapper;
    private final SystemLogMapper systemLogMapper;
    private final LivestockMapper livestockMapper;
    private final BreedingRecordMapper breedingRecordMapper;
    private final PolicyMapper policyMapper;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        ensureSchema();
        if (adminUserMapper.selectCount(null) > 0) {
            log.info("数据库已初始化，检查新增模块 seed...");
            seedNewModulesIfEmpty();
        } else {
            seed();
            log.info("数据库初始化完成！");
        }
        ensureRoleAccounts();
        seedWangYoudeData();
        seedBusinessEntityProducts();
        seedFarmerBizProducts();
        backfillFarmerIds();
    }

    /** 兼容既有数据库：为 admin_users 补 grid_id（网格员所属网格）、products 补 owner_id（经营主体专属产品） */
    void ensureSchema() {
        try {
            jdbcTemplate.execute("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS grid_id VARCHAR(64)");
        } catch (Exception ex) {
            log.warn("补充 admin_users.grid_id 列失败（可能已存在）: {}", ex.getMessage());
        }
        try {
            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS owner_id BIGINT");
        } catch (Exception ex) {
            log.warn("补充 products.owner_id 列失败（可能已存在）: {}", ex.getMessage());
        }
        try {
            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS farmer_id BIGINT");
        } catch (Exception ex) {
            log.warn("补充 products.farmer_id 列失败（可能已存在）: {}", ex.getMessage());
        }
        try {
            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS review_note VARCHAR(255)");
        } catch (Exception ex) {
            log.warn("补充 products.review_note 列失败（可能已存在）: {}", ex.getMessage());
        }
    }

    /** 幂等：确保四类层级演示账号存在（老库升级时补种，不覆盖已有账号） */
    void ensureRoleAccounts() {
        ensureAdmin("admin", "admin123", "黄雪琳", "SUPER_ADMIN", "平台运营方", "全部", "#ef4444", null);
        ensureAdmin("cungan", "123456", "洪梦冉", "VILLAGE_ADMIN", "村党支部", "内容、用户", "#f5a623", null);
        ensureAdmin("wange1", "123456", "赵大哥", "GRID_WORKER", "中堰村1组片区", "网格采集", "#0ea5e9", "GRID_01");
        ensureAdmin("wange2", "123456", "刘阿姨", "GRID_WORKER", "中堰村2组片区", "网格采集", "#10d6a0", "GRID_03");
        ensureAdmin("hezuoshe", "123456", "陈国平", "BUSINESS_ENTITY", "中堰村绿源农业合作社", "产业、电商", "#9B59B6", null);
    }

    void ensureAdmin(String username, String password, String name, String role, String org, String permissions, String avatarColor, String gridId) {
        AdminUser existing = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>().eq(AdminUser::getUsername, username));
        if (existing == null) {
            adminUserMapper.insert(u(username, password, name, role, org, "138****0000", "在线", permissions, avatarColor, "2026-06-23 08:30", gridId));
        } else {
            // 老库升级：把演示账号的角色/机构/网格归位为规范值（不覆盖密码等，幂等）
            existing.setRole(role);
            existing.setOrg(org);
            existing.setGridId(gridId);
            adminUserMapper.updateById(existing);
        }
    }

    /**
     * 为当前演示农户王友德补个人数据（幂等）：地块/作物/补贴/医保养老，farmer_id = 王友德.id。
     * 与村集体台账（farmer_id 为空）区分开，供农户端「我的数据」真实接口读取。
     */
    void seedWangYoudeData() {
        Farmer wang = farmerMapper.selectOne(
                new LambdaQueryWrapper<Farmer>().eq(Farmer::getUsername, "wangyoude123"));
        if (wang == null) return;
        Long wid = wang.getId();

        if (landMapper.selectCount(new LambdaQueryWrapper<Land>().eq(Land::getFarmerId, wid)) == 0) {
            Land l1 = l("1号地块", 4.2, "潮土", "村东 · 东沟", "油菜", "生长期", true, 35.120, 110.452, "2025-10-01"); l1.setFarmerId(wid);
            Land l2 = l("2号地块", 2.4, "潮土", "村南 · 南坡", "玉米", "生长期", false, 35.118, 110.462, "2025-10-01"); l2.setFarmerId(wid);
            Land l3 = l("3号地块", 2.0, "潮土", "村西 · 晒场旁", "玉米", "生长期", false, 35.116, 110.455, "2025-10-01"); l3.setFarmerId(wid);
            landMapper.insert(l1); landMapper.insert(l2); landMapper.insert(l3);
            log.info("王友德地块数据已补种");
        }
        if (cropMapper.selectCount(new LambdaQueryWrapper<Crop>().eq(Crop::getFarmerId, wid)) == 0) {
            Crop c1 = c("油菜", "秦优10号", "2025-10-15", "210天", "180 kg/亩", 4.2, "开花期", "硼肥+复合肥", "生长期", "自家承包地冬油菜"); c1.setFarmerId(wid);
            Crop c2 = c("玉米", "郑单958", "2026-05-20", "120天", "550 kg/亩", 4.4, "抽穗期", "尿素+磷酸二铵", "生长期", "夏玉米"); c2.setFarmerId(wid);
            cropMapper.insert(c1); cropMapper.insert(c2);
            log.info("王友德作物数据已补种");
        }
        if (subsidyMapper.selectCount(new LambdaQueryWrapper<Subsidy>().eq(Subsidy::getFarmerId, wid)) == 0) {
            Subsidy s1 = s("王友德", "耕地地力保护补贴", 560.0, "已发放", "2026-06-30", 100, "土地承包合同、身份证复印件", "镇农办"); s1.setFarmerId(wid);
            subsidyMapper.insert(s1);
            log.info("王友德补贴数据已补种");
        }
        if (insuranceMapper.selectCount(new LambdaQueryWrapper<Insurance>().eq(Insurance::getFarmerId, wid)) == 0) {
            Insurance i1 = i("王友德", "610***********0001", "城乡居民医保", "正常参保", "¥1,120", "城乡居民养老保险", "正常领取", "¥3,600", "¥145", "2026-01-15", "2026-06-01", "汉滨区中医院", "常规体检", "¥0"); i1.setFarmerId(wid);
            insuranceMapper.insert(i1);
            log.info("王友德医保养老数据已补种");
        }
        if (livestockMapper.selectCount(new LambdaQueryWrapper<Livestock>().eq(Livestock::getFarmerId, wid)) == 0) {
            Livestock lv1 = ls("WYD-JQ-202605-001", "自家散养土鸡", "家禽", "土鸡", "本地散养鸡", 120, 118, "只", "1号地块旁鸡舍", "2026-05-01", "2026-11-01", "散养中", "健康", "自繁", "王友德", "138****5678", "中堰村", "放养为主，每日补饲玉米", "2026-08-15"); lv1.setFarmerId(wid);
            Livestock lv2 = ls("WYD-SZ-202604-001", "圈养生猪", "家畜", "生猪", "长白猪", 8, 8, "头", "2号地块旁猪舍", "2026-04-10", "2026-10-10", "育肥中", "健康", "外购仔猪", "王友德", "138****5678", "中堰村", "按时驱虫、定期消毒", "2026-08-16"); lv2.setFarmerId(wid);
            livestockMapper.insert(lv1); livestockMapper.insert(lv2);
            log.info("王友德养殖数据已补种");
        }
    }

    /**
     * 既有业务数据农户归属回填（幂等）：按姓名/负责人映射到 farmer.id。
     * 仅当 farmer_id 为空且姓名能在 farmer 表匹配到时回填，重复启动不会覆盖。
     * 地块/作物为村集体台账（无明确户主），保持 farmer_id 为空 → 仅管理员可见。
     */
    void backfillFarmerIds() {
        List<Farmer> farmers = farmerMapper.selectList(null);
        if (farmers.isEmpty()) return;
        Map<String, Long> byName = farmers.stream()
                .collect(Collectors.toMap(Farmer::getName, Farmer::getId, (a, b) -> a));

        // 医保/补贴：name 字段即户主姓名
        insuranceMapper.selectList(null).forEach(i -> {
            if (i.getFarmerId() == null && byName.containsKey(i.getName())) {
                i.setFarmerId(byName.get(i.getName()));
                insuranceMapper.updateById(i);
            }
        });
        subsidyMapper.selectList(null).forEach(s -> {
            if (s.getFarmerId() == null && byName.containsKey(s.getName())) {
                s.setFarmerId(byName.get(s.getName()));
                subsidyMapper.updateById(s);
            }
        });
        // 养殖档案：manager 字段即负责人
        livestockMapper.selectList(null).forEach(l -> {
            if (l.getFarmerId() == null && byName.containsKey(l.getManager())) {
                l.setFarmerId(byName.get(l.getManager()));
                livestockMapper.updateById(l);
            }
        });
        log.info("farmer_id 归属回填完成");
    }

    /** 对已初始化的数据库，逐一检查新增模块是否需要补种数据 */
    void seedNewModulesIfEmpty() {
        if (farmerMapper.selectCount(null) == 0) {
            seedFarmers();
            log.info("农户账号种子数据已补种");
        }
        if (livestockMapper.selectCount(null) == 0) {
            seedLivestock();
            log.info("养殖档案种子数据已补种");
        }
        // 确保 breeding_record 表存在（不依赖 schema.sql，更可靠）
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS breeding_record (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "archive_id BIGINT, batch_no VARCHAR(64), batch_name VARCHAR(128), " +
                "type VARCHAR(32), content TEXT, record_time VARCHAR(32), " +
                "recorder VARCHAR(32), created_at VARCHAR(32))");
        } catch (Exception ex) {
            log.warn("创建 breeding_record 表失败（可能已存在）: {}", ex.getMessage());
        }
        if (breedingRecordMapper.selectCount(null) == 0) {
            seedBreedingRecords();
            log.info("养殖记录种子数据已补种");
        }
        if (policyMapper.selectCount(null) == 0) {
            seedPolicy();
            log.info("惠农政策种子数据已补种");
        }
    }

    void seed() {
        seedAdminUsers();
        seedFarmers();
        seedLands();
        seedCrops();
        seedFarmingRecords();
        seedProducts();
        seedOrders();
        seedBnbs();
        seedScenicSpots();
        seedTrainingCourses();
        seedInsurances();
        seedSubsidies();
        seedElders();
        seedSystemLogs();
        seedLivestock();
        seedBreedingRecords();
        seedPolicy();
    }

    void seedAdminUsers() {
        for (AdminUser u : List.of(
                // 平台超级管理员（最高权限）
                u("admin", "admin123", "黄雪琳", "SUPER_ADMIN", "平台运营方", "138****0001", "在线", "全部", "#ef4444", "2026-06-23 08:30", null),
                // 村级管理员（村干部，管本村）
                u("cungan", "123456", "洪梦冉", "VILLAGE_ADMIN", "村党支部", "138****0002", "在线", "内容、用户", "#f5a623", "2026-06-23 09:00", null),
                u("wang", "wang123", "王雍皓", "VILLAGE_ADMIN", "村民委员会", "138****0003", "离线", "订单、民宿", "#0ea5e9", "2026-06-22 17:30", null),
                // 网格员（负责各自网格的采集/走访/上报）
                u("wange1", "123456", "赵大哥", "GRID_WORKER", "中堰村1组片区", "138****0004", "在线", "网格采集", "#0ea5e9", "2026-06-23 07:45", "GRID_01"),
                u("wange2", "123456", "刘阿姨", "GRID_WORKER", "中堰村2组片区", "138****0005", "离线", "网格采集", "#10d6a0", "2026-06-22 18:00", "GRID_03")
        )) adminUserMapper.insert(u);
    }

    void seedFarmers() {
        for (Farmer f : List.of(
                f("wangyoude123", "王友德", "farmer_001", "中堰村", "1组片区", "第2网格", "GRID_02", "138****5678", "2026-08-20 08:30"),
                f("zhaodage123", "赵大哥", "farmer_002", "中堰村", "1组片区", "第1网格", "GRID_01", "137****2345", "2026-08-19 18:00"),
                f("lishen123", "李婶", "farmer_003", "中堰村", "2组片区", "第1网格", "GRID_03", "138****8901", "2026-08-20 07:45"),
                f("zhangdashu123", "张大叔", "farmer_004", "中堰村", "2组片区", "第2网格", "GRID_04", "137****2345", "2026-08-19 16:20"),
                f("liuayi123", "刘阿姨", "farmer_005", "中堰村", "3组片区", "第1网格", "GRID_05", "139****6789", "2026-08-18 09:10"),
                f("wangdaye123", "王大爷", "farmer_006", "中堰村", "3组片区", "第2网格", "GRID_06", "137****2345", "2026-08-17 11:00"),
                f("zhangdaye123", "张大爷", "farmer_007", "中堰村", "1组片区", "第1网格", "GRID_01", "139****6789", "2026-08-20 08:00")
        )) farmerMapper.insert(f);
    }

    void seedLands() {
        for (Land l : List.of(
                l("苹果园区A区", 320.0, "褐土", "村东山坡", "红富士苹果", "盛果期", true, 35.123, 110.456, "2022-03-15"),
                l("南片麦田", 480.0, "潮土", "村南平地", "冬小麦", "已收割", true, 35.118, 110.462, "2024-10-01"),
                l("北山核桃林", 180.0, "褐土", "北山缓坡", "核桃", "生长期", false, 35.131, 110.448, "2023-04-01"),
                l("蔬菜大棚区", 120.0, "潮土", "村西河边", "番茄/黄瓜", "采收中", true, 35.120, 110.452, "2025-01-10"),
                l("樱桃基地", 85.0, "褐土", "村东北", "樱桃", "生长期", true, 35.127, 110.460, "2024-02-20")
        )) landMapper.insert(l);
    }

    void seedCrops() {
        for (Crop c : List.of(
                c("红富士苹果", "烟富3号", "2022-03-20", "240天", "2,500 kg/亩", 530.0, "果实膨大期", "有机肥+复合肥", "盛果期", "引自山东烟台，果形端正，色泽艳丽"),
                c("冬小麦", "济麦22", "2025-10-15", "230天", "550 kg/亩", 480.0, "已收割", "尿素+磷酸二铵", "已收割", "优质强筋小麦品种"),
                c("核桃", "辽核1号", "2023-04-01", "多年生", "1,200 kg/亩", 180.0, "硬核期", "有机肥", "生长期", "早实核桃品种，壳薄仁饱"),
                c("樱桃", "美早", "2024-02-20", "多年生", "800 kg/亩", 85.0, "着色期", "有机肥+钾肥", "生长期", "大果型甜樱桃，果肉硬脆")
        )) cropMapper.insert(c);
    }

    void seedFarmingRecords() {
        for (FarmingRecord r : List.of(
                r("施肥", "红富士苹果", "苹果园区A区", "2026-06-15", "追施复合肥 25kg/亩，配合叶面喷施钙肥", "赵大哥", "晴 28°C"),
                r("灌溉", "番茄/黄瓜", "蔬菜大棚区", "2026-06-15", "滴灌 2小时，用水量 180m³", "刘阿姨", "多云 26°C"),
                r("打药", "红富士苹果", "苹果园区A区", "2026-06-14", "喷施杀菌剂+杀虫剂", "赵大哥", "晴 30°C"),
                r("修剪", "红富士苹果", "苹果园区B区", "2026-06-13", "夏季修剪，疏除过密枝、徒长枝", "张大叔", "阴 25°C"),
                r("施肥", "樱桃", "樱桃基地", "2026-06-12", "追施钾肥 15kg/亩", "李婶", "晴 27°C")
        )) farmingRecordMapper.insert(r);
    }

    void seedProducts() {
        for (Product p : List.of(
                p("中堰红富士苹果", "水果类", 68.0, "箱/5kg", 520, 1280, "上架", "高山种植，脆甜多汁", "赵大哥", "苹果园区A区", "TR001", "2022-03-20", "2026-10-01"),
                p("有机核桃", "特色农产品类", 45.0, "袋/2kg", 180, 650, "上架", "壳薄仁饱", "张大叔", "北山核桃林", "TR002", "2023-04-01", "2026-09-15"),
                p("大樱桃", "水果类", 98.0, "箱/3kg", 85, 420, "上架", "美早品种，果大肉脆", "李婶", "樱桃基地", "TR003", null, null),
                p("农家土鸡蛋", "生鲜类", 35.0, "盒/30枚", 230, 890, "上架", "散养土鸡", "王大爷", "养鸡场1号", "TR004", null, null),
                p("有机蔬菜礼盒", "生鲜类", 88.0, "箱/8种", 60, 310, "上架", "大棚种植，当日采摘", "刘阿姨", "蔬菜大棚区", "TR005", null, null),
                p("中堰小米", "粮食类", 28.0, "袋/2.5kg", 350, 560, "上架", "传统种植", "赵大哥", "南片麦田", "TR006", null, null)
        )) productMapper.insert(p);
    }

    /** 为演示经营主体（绿源合作社）补专属产品（幂等）：owner_id = 该经营主体 admin.id，与村集体产品区分 */
    void seedBusinessEntityProducts() {
        AdminUser biz = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>().eq(AdminUser::getUsername, "hezuoshe"));
        if (biz == null) return;
        if (productMapper.selectCount(new LambdaQueryWrapper<Product>().eq(Product::getOwnerId, biz.getId())) > 0) return;
        productMapper.insert(bp("富硒黄桃", "水果类", 88.0, "斤", 320, 1560, "上架", "高山富硒·香甜多汁，合作社自产", biz.getId()));
        productMapper.insert(bp("有机蔬菜礼盒", "蔬菜类", 68.0, "箱/8种", 200, 890, "上架", "大棚有机种植，当日采摘", biz.getId()));
        productMapper.insert(bp("稻花香大米", "粮食类", 45.0, "袋/5kg", 500, 2300, "上架", "合作社稻田自产，颗粒饱满", biz.getId()));
        log.info("经营主体产品数据已补种");
    }

    /** 为演示村民王友德补「我要卖」农产品（幂等）：farmer_id = 王友德.id，仅本人可见 */
    void seedFarmerBizProducts() {
        Farmer wang = farmerMapper.selectOne(
                new LambdaQueryWrapper<Farmer>().eq(Farmer::getUsername, "wangyoude123"));
        if (wang == null) return;
        if (productMapper.selectCount(new LambdaQueryWrapper<Product>().eq(Product::getFarmerId, wang.getId())) > 0) return;
        productMapper.insert(fp("农家土鸡蛋", "禽蛋类", 35.0, "盒/30枚", 50, 12, "在售", "散养土鸡，当日捡蛋", wang.getId()));
        productMapper.insert(fp("本地玉米", "粮食类", 20.0, "袋/5kg", 100, 8, "在售", "自种夏玉米，颗粒饱满", wang.getId()));
        productMapper.insert(fp("时令蔬菜", "蔬菜类", 25.0, "箱/5kg", 30, 5, "在售", "自家菜地当季现摘", wang.getId()));
        log.info("村民我要卖产品数据已补种");
    }

    void seedOrders() {
        for (Order o : List.of(
                o("BNB0617", "田园居·家庭房", "张女士", 1, 576.0, "已支付", "2026-06-22", "顺丰", "西安市雁塔区", null, "民宿"),
                o("TK001", "苹果采摘园×2", "张女士", 2, 60.0, "已支付", "2026-06-20", null, null, null, "门票"),
                o("ACT001", "苹果采摘节×2", "赵大哥", 2, 60.0, "已支付", "2026-06-18", null, null, null, "活动"),
                o("BNB0618", "湖畔小院·湖景房", "王女士", 1, 856.0, "待支付", "2026-06-23", null, null, null, "民宿"),
                o("SUB001", "创业补贴", "肖子微", 1, 8000.0, "审核中", "2026-06-10", null, null, null, "补贴"),
                o("ORD001", "红富士苹果", "李女士", 3, 204.0, "已签收", "2026-06-17", "顺丰 SF123", "西安市雁塔区", null, "商品")
        )) orderMapper.insert(o);
    }

    void seedBnbs() {
        for (Bnb b : List.of(
                b("田园居", "王大爷", "139****6789", 6, 188.0, 4.8, 320, "¥3.8万", "营业中", "2023-03", "独栋小院，自带菜园，采摘体验", "陕旅备2024001", "采摘/农家饭"),
                b("山景阁", "李婶", "138****8901", 4, 258.0, 4.9, 186, "¥3.2万", "营业中", "2023-06", "半山腰观景民宿", "陕旅备2024002", "山景/摄影"),
                b("果园人家", "赵大哥", "137****2345", 8, 158.0, 4.6, 450, "¥4.2万", "营业中", "2022-09", "紧邻苹果园，含农家早餐", "陕旅备2024003", "亲子/采摘"),
                b("云栖小筑", "陈女士", null, 10, 298.0, 4.9, 280, "¥5.1万", "审核中", "2024-01", "星空露台，围炉夜话", "陕旅备2024004", "高端/星空"),
                b("星河营地", "秦老板", null, 15, 388.0, 4.9, 420, "¥11.2万", "营业中", "2024-02", "帐篷营地，星空观测", "陕旅备2024009", "露营/星空")
        )) bnbMapper.insert(b);
    }

    void seedScenicSpots() {
        for (ScenicSpot s : List.of(
                s("中堰古村落", "人文景观", "AAA", 0.0, 3200, "保存完好的清代民居建筑群", "全天", "停车场/导览/公厕"),
                s("核桃林观景台", "自然风光", null, 0.0, 1800, "登高远眺，云海日出最佳观赏点", "06:00-19:00", "观景台/步道"),
                s("苹果采摘园", "体验农业", null, 30.0, 5600, "秋季采摘体验，亲子游首选", "08:00-17:00", "停车场/休息区"),
                s("樱桃谷", "体验农业", null, 50.0, 2400, "春季赏樱桃花，夏季摘樱桃", "08:00-17:00", "停车场/凉亭")
        )) scenicSpotMapper.insert(s);
    }

    void seedTrainingCourses() {
        for (TrainingCourse t : List.of(
                t("病虫害防治培训", "种植技术", "县植保站 陈老师", "高级农艺师，从事植保工作15年", "2026-07-02", "09:30", "2.5小时", 18, 50, "报名中", "苹果园区A区", "现场教学",
                        "系统学习常见病虫害识别与科学防控",
                        "[\"常见病虫害识别\",\"农药科学使用\",\"病虫害预警系统应用\"]",
                        "[\"果树病虫害图谱\",\"农药安全使用手册\"]"),
                t("现代农业技术培训", "种植技术", "市农科院 王教授", "省级农业专家", "2026-07-08", "09:00", "3小时", 12, 40, "报名中", "蔬菜大棚区", "现场教学",
                        "掌握智能灌溉与水肥一体化核心技术",
                        "[\"智能灌溉技术\",\"水肥一体化技术\",\"数字农业平台应用\"]",
                        "[\"水肥一体化技术指南\"]"),
                t("电商直播培训", "电商运营", "电商中心 刘老师", "5年农产品直播经验", "2026-07-15", "14:00", "2小时", 25, 40, "报名中", "村委会会议室", "线下",
                        "从零开始学直播带货",
                        "[\"短视频制作\",\"直播带货技巧\",\"电商运营方法\"]",
                        "[\"农产品直播实操指南\"]"),
                t("智慧农业应用培训", "数字农业", "黄雪琳书记", "数字乡村建设带头人", "2026-07-25", "10:00", "2小时", 20, 50, "报名中", "村委会会议室", "线下+直播",
                        "学会使用数字乡村平台",
                        "[\"物联网监测设备\",\"数据采集与分析\",\"智慧农业平台使用\"]",
                        "[\"数字乡村平台操作指南\"]")
        )) trainingCourseMapper.insert(t);
    }

    void seedInsurances() {
        for (Insurance i : List.of(
                i("张大爷", "610***********0012", "城乡居民医保", "正常参保", "¥1,280", "城乡居民养老保险", "正常领取", "¥3,600", "¥300", "2026-01-15", "2026-05-20", "安康市人民医院", "高血压复查", "¥860"),
                i("李婶", "610***********0023", "城乡居民医保", "正常参保", "¥960", "城乡居民养老保险", "正常领取", "¥2,880", "¥240", "2026-01-15", "2026-06-10", "汉滨区中医院", "腰椎间盘突出", "¥1,250"),
                i("王大爷", "610***********0034", "职工医保", "正常参保", "¥3,520", "职工养老保险", "正常领取", "¥28,800", "¥2,400", "2026-01-01", "2026-04-15", "安康市中心医院", "糖尿病随访", "¥1,680"),
                i("赵大哥", "610***********0045", "城乡居民医保", "正常参保", "¥720", "城乡居民养老保险", "参保中", "-", "-", "2026-01-15", "2026-06-01", "汉滨区人民医院", "感冒发烧", "¥180")
        )) insuranceMapper.insert(i);
    }

    void seedSubsidies() {
        for (Subsidy s : List.of(
                s("张大爷", "耕地地力保护补贴", 1200.0, "已发放", "2026-03-20", 100, "土地承包合同、身份证复印件", "镇农办"),
                s("李婶", "农机购置补贴", 5000.0, "已发放", "2026-04-10", 100, "购机发票、身份证、银行卡", "县农机站"),
                s("王大爷", "低保补助", 3600.0, "发放中", "2026-01-01", 100, "低保证明、收入证明", "镇民政办"),
                s("赵大哥", "耕地地力保护补贴", 3000.0, "审核中", "2026-06-01", 60, "土地承包合同、身份证复印件", "镇农办"),
                s("肖子微", "创业补贴", 8000.0, "审核中", "2026-06-10", 40, "营业执照、创业计划书", "县人社局")
        )) subsidyMapper.insert(s);
    }

    void seedElders() {
        for (Elder e : List.of(
                e("张奶奶", 82, "女", "2组", "独居", "张大爷（子）", "139****6789", "智能手环", "正常", "10分钟前", "高血压、关节炎", 0, 1, "张大爷 139****6789"),
                e("李爷爷", 78, "男", "1组", "与子女同住", "李婶（女）", "138****8901", "智能手环", "正常", "5分钟前", "糖尿病", 0, 0, "李婶 138****8901"),
                e("王奶奶", 85, "女", "3组", "独居", "王大爷（子）", "137****2345", "无", "需关注", "2小时前", "心脏病", 1, 3, "王大爷 137****2345"),
                e("周爷爷", 91, "男", "3组", "独居", "周先生（子）", "134****1234", "智能手环", "重点关注", "30分钟前", "心脏病、糖尿病", 2, 5, "周先生 134****1234;120急救")
        )) elderMapper.insert(e);
    }

    void seedSystemLogs() {
        for (SystemLog sl : List.of(
                sl("2026-06-23 10:30", "黄雪琳", "审核通过民宿\"云栖小筑\"", "审核", "192.168.1.1"),
                sl("2026-06-23 09:45", "洪梦冉", "新增培训课程", "内容", "192.168.1.2"),
                sl("2026-06-23 08:30", "黄雪琳", "管理员登录", "系统", "192.168.1.1"),
                sl("2026-06-22 22:15", "系统", "自动备份数据库完成", "系统", "-"),
                sl("2026-06-22 17:30", "王雍皓", "处理退款申请", "订单", "192.168.1.3")
        )) systemLogMapper.insert(sl);
    }

    void seedLivestock() {
        for (Livestock ls : List.of(
                ls("ZY-SC-202603-001", "2026年春季加州鲈批次", "水产", "鲈鱼", "加州鲈", 5500, 5000, "尾", "荷虾混养区A塘", "2026-03-15", "2026-09-15", "成长期", "正常", "自繁", "赵大哥", "139****6789", "中堰村", "生长状况良好，定期换水", "2026-07-20"),
                ls("ZY-SC-202604-001", "2026年澳洲淡水龙虾批次", "水产", "澳洲淡水龙虾", "澳洲品系", 85000, 80000, "尾", "智能水产养殖基地1号池", "2026-04-01", "2026-10-01", "成长期", "正常", "外购虾苗", "李婶", "138****8901", "中堰村", "定期检测水质，氨氮指标正常", "2026-07-18"),
                ls("ZY-SC-202605-001", "2026年罗非鱼育成批次", "水产", "罗非鱼", "吉富品系", 32000, 30000, "尾", "智慧渔业车间2号池", "2026-05-01", "2026-11-01", "育成期", "观察中", "自繁", "张大叔", "137****2345", "中堰村", "近期出现少量死亡，已采样送检", "2026-07-22")
        )) livestockMapper.insert(ls);
    }

    // ---- helper factories ----
    AdminUser u(String username, String password, String name, String role, String org, String phone, String status, String permissions, String avatarColor, String lastLogin, String gridId) {
        AdminUser u = new AdminUser();
        u.setUsername(username); u.setPassword(password); u.setName(name); u.setRole(role);
        u.setOrg(org); u.setPhone(phone); u.setStatus(status); u.setPermissions(permissions);
        u.setAvatarColor(avatarColor); u.setLastLogin(lastLogin);
        u.setGridId(gridId);
        return u;
    }

    Farmer f(String username, String name, String farmerId, String village, String zone, String grid, String gridId, String phone, String lastLogin) {
        Farmer f = new Farmer();
        f.setUsername(username); f.setPassword("123456"); f.setName(name); f.setFarmerId(farmerId);
        f.setVillage(village); f.setZone(zone); f.setGrid(grid); f.setGridId(gridId);
        f.setPhone(phone); f.setRole("村民"); f.setStatus("离线"); f.setLastLogin(lastLogin);
        return f;
    }

    Land l(String name, Double area, String soilType, String location, String crop, String status, Boolean irrigation, Double gisLat, Double gisLng, String createdAt) {
        Land l = new Land();
        l.setName(name); l.setArea(area); l.setSoilType(soilType); l.setLocation(location);
        l.setCrop(crop); l.setStatus(status); l.setIrrigation(irrigation);
        l.setGisLat(gisLat); l.setGisLng(gisLng); l.setCreatedAt(createdAt);
        return l;
    }

    Crop c(String name, String variety, String plantDate, String cycle, String expectedYield, Double area, String stage, String fertilizer, String status, String description) {
        Crop c = new Crop();
        c.setName(name); c.setVariety(variety); c.setPlantDate(plantDate); c.setCycle(cycle);
        c.setExpectedYield(expectedYield); c.setArea(area); c.setStage(stage);
        c.setFertilizer(fertilizer); c.setStatus(status); c.setDescription(description);
        return c;
    }

    FarmingRecord r(String type, String cropName, String plot, String date, String detail, String operator, String weather) {
        FarmingRecord r = new FarmingRecord();
        r.setType(type); r.setCropName(cropName); r.setPlot(plot); r.setDate(date);
        r.setDetail(detail); r.setOperator(operator); r.setWeather(weather);
        return r;
    }

    Product p(String name, String category, Double price, String unit, Integer stock, Integer sales, String status, String description, String farmer, String plot, String traceId, String plantDate, String harvestDate) {
        Product p = new Product();
        p.setName(name); p.setCategory(category); p.setPrice(price); p.setUnit(unit);
        p.setStock(stock); p.setSales(sales); p.setStatus(status); p.setDescription(description);
        p.setFarmer(farmer); p.setPlot(plot); p.setTraceId(traceId);
        p.setPlantDate(plantDate); p.setHarvestDate(harvestDate);
        return p;
    }

    Product bp(String name, String category, Double price, String unit, Integer stock, Integer sales, String status, String description, Long ownerId) {
        Product p = new Product();
        p.setName(name); p.setCategory(category); p.setPrice(price); p.setUnit(unit);
        p.setStock(stock); p.setSales(sales); p.setStatus(status); p.setDescription(description);
        p.setOwnerId(ownerId);
        return p;
    }

    Product fp(String name, String category, Double price, String unit, Integer stock, Integer sales, String status, String description, Long farmerId) {
        Product p = new Product();
        p.setName(name); p.setCategory(category); p.setPrice(price); p.setUnit(unit);
        p.setStock(stock); p.setSales(sales); p.setStatus(status); p.setDescription(description);
        p.setFarmerId(farmerId);
        return p;
    }

    Order o(String orderNo, String productName, String buyer, Integer quantity, Double amount, String status, String date, String logistics, String address, String phone, String orderType) {
        Order o = new Order();
        o.setOrderNo(orderNo); o.setProductName(productName); o.setBuyer(buyer);
        o.setQuantity(quantity); o.setAmount(amount); o.setStatus(status); o.setDate(date);
        o.setLogistics(logistics); o.setAddress(address); o.setPhone(phone); o.setOrderType(orderType);
        return o;
    }

    Bnb b(String name, String owner, String phone, Integer rooms, Double price, Double rating, Integer bookings, String revenue, String status, String since, String description, String licenseNo, String tags) {
        Bnb b = new Bnb();
        b.setName(name); b.setOwner(owner); b.setPhone(phone); b.setRooms(rooms);
        b.setPrice(price); b.setRating(rating); b.setBookings(bookings); b.setRevenue(revenue);
        b.setStatus(status); b.setSince(since); b.setDescription(description);
        b.setLicenseNo(licenseNo); b.setTags(tags);
        return b;
    }

    ScenicSpot s(String name, String type, String level, Double tickets, Integer visitors, String description, String openTime, String facilities) {
        ScenicSpot s = new ScenicSpot();
        s.setName(name); s.setType(type); s.setLevel(level); s.setTickets(tickets);
        s.setVisitors(visitors); s.setDescription(description); s.setOpenTime(openTime);
        s.setFacilities(facilities);
        return s;
    }

    TrainingCourse t(String title, String category, String teacher, String teacherBio, String date, String time, String duration, Integer joined, Integer limitCount, String status, String location, String formatType, String description, String outline, String materials) {
        TrainingCourse t = new TrainingCourse();
        t.setTitle(title); t.setCategory(category); t.setTeacher(teacher); t.setTeacherBio(teacherBio);
        t.setDate(date); t.setTime(time); t.setDuration(duration);
        t.setJoined(joined); t.setLimitCount(limitCount); t.setStatus(status);
        t.setLocation(location); t.setFormatType(formatType); t.setDescription(description);
        t.setOutline(outline); t.setMaterials(materials);
        return t;
    }

    Insurance i(String name, String idCard, String medType, String medStatus, String medBalance, String pensionType, String penStatus, String penBalance, String penMonthly, String lastMedPay, String lastVisit, String hospital, String diagnosis, String reimburse) {
        Insurance i = new Insurance();
        i.setName(name); i.setIdCard(idCard); i.setMedType(medType); i.setMedStatus(medStatus);
        i.setMedBalance(medBalance); i.setPensionType(pensionType); i.setPenStatus(penStatus);
        i.setPenBalance(penBalance); i.setPenMonthly(penMonthly); i.setLastMedPay(lastMedPay);
        i.setLastVisit(lastVisit); i.setHospital(hospital); i.setDiagnosis(diagnosis); i.setReimburse(reimburse);
        return i;
    }

    Subsidy s(String name, String type, Double amount, String status, String date, Integer progress, String material, String handler) {
        Subsidy s = new Subsidy();
        s.setName(name); s.setType(type); s.setAmount(amount); s.setStatus(status);
        s.setDate(date); s.setProgress(progress); s.setMaterial(material); s.setHandler(handler);
        return s;
    }

    Elder e(String name, Integer age, String gender, String address, String livingType, String contact, String contactPhone, String device, String status, String lastActive, String health, Integer alert24h, Integer alertMonth, String emergency) {
        Elder e = new Elder();
        e.setName(name); e.setAge(age); e.setGender(gender); e.setAddress(address);
        e.setLivingType(livingType); e.setContact(contact); e.setContactPhone(contactPhone);
        e.setDevice(device); e.setStatus(status); e.setLastActive(lastActive);
        e.setHealth(health); e.setAlert24h(alert24h); e.setAlertMonth(alertMonth); e.setEmergency(emergency);
        return e;
    }

    SystemLog sl(String time, String user, String action, String type, String ip) {
        SystemLog sl = new SystemLog();
        sl.setTime(time); sl.setUser(user); sl.setAction(action); sl.setType(type); sl.setIp(ip);
        return sl;
    }

    void seedBreedingRecords() {
        for (BreedingRecord r : List.of(
                // 加州鲈批次 (archiveId=1)
                br(1L, "ZY-SC-202603-001", "2026年春季加州鲈批次", "投喂记录", "投喂加州鲈专用饲料2号，投喂量42kg，鱼群抢食积极", "2026-08-05 07:30", "赵大哥", "2026-08-05 07:35"),
                br(1L, "ZY-SC-202603-001", "2026年春季加州鲈批次", "消毒记录", "使用聚维酮碘全池泼洒消毒，浓度0.3ppm，预防细菌性疾病", "2026-08-03 14:00", "赵大哥", "2026-08-03 14:15"),
                br(1L, "ZY-SC-202603-001", "2026年春季加州鲈批次", "采样记录", "随机捞取20尾测量体长体重，平均体长18.5cm，平均体重320g，生长速度正常", "2026-08-01 10:00", "赵大哥", "2026-08-01 10:30"),
                // 澳洲淡水龙虾批次 (archiveId=2)
                br(2L, "ZY-SC-202604-001", "2026年澳洲淡水龙虾批次", "投喂记录", "投喂澳洲淡水龙虾配合饲料，投喂量30kg，观察进食情况良好", "2026-08-05 18:00", "李婶", "2026-08-05 18:15"),
                br(2L, "ZY-SC-202604-001", "2026年澳洲淡水龙虾批次", "其他记录", "检测氨氮0.35mg/L偏高，已开启增氧机并减少投喂量", "2026-08-04 09:00", "李婶", "2026-08-04 09:20"),
                br(2L, "ZY-SC-202604-001", "2026年澳洲淡水龙虾批次", "转池记录", "将3号暂养池虾苗转入1号主养池，共计12000尾，规格整齐", "2026-07-20 08:00", "李婶", "2026-07-20 08:45"),
                // 罗非鱼批次 (archiveId=3)
                br(3L, "ZY-SC-202605-001", "2026年罗非鱼育成批次", "用药记录", "发现少量鱼体表有寄生虫，使用硫酸铜硫酸亚铁合剂全池泼洒，浓度0.7ppm", "2026-08-04 16:00", "张大叔", "2026-08-04 16:30"),
                br(3L, "ZY-SC-202605-001", "2026年罗非鱼育成批次", "死亡记录", "今日捡出死鱼12尾，均已采样送检，初步判断为应激性死亡，已加强增氧", "2026-08-03 07:00", "张大叔", "2026-08-03 07:20"),
                br(3L, "ZY-SC-202605-001", "2026年罗非鱼育成批次", "其他记录", "更换循环水系统滤网，清洗沉淀池，水质明显改善", "2026-08-02 11:00", "张大叔", "2026-08-02 11:30")
        )) breedingRecordMapper.insert(r);
    }

    BreedingRecord br(Long archiveId, String batchNo, String batchName, String type, String content, String recordTime, String recorder, String createdAt) {
        BreedingRecord r = new BreedingRecord();
        r.setArchiveId(archiveId); r.setBatchNo(batchNo); r.setBatchName(batchName);
        r.setType(type); r.setContent(content); r.setRecordTime(recordTime);
        r.setRecorder(recorder); r.setCreatedAt(createdAt);
        return r;
    }

    Livestock ls(String batchNo, String batchName, String category, String type, String breed, Integer initialCount, Integer count, String unit, String area, String startDate, String expectDate, String stage, String health, String source, String manager, String phone, String villageName, String remark, String updatedAt) {
        Livestock ls = new Livestock();
        ls.setBatchNo(batchNo); ls.setBatchName(batchName); ls.setCategory(category); ls.setType(type);
        ls.setBreed(breed); ls.setInitialCount(initialCount); ls.setCount(count); ls.setUnit(unit);
        ls.setArea(area); ls.setStartDate(startDate); ls.setExpectDate(expectDate); ls.setStage(stage);
        ls.setHealth(health); ls.setSource(source); ls.setManager(manager); ls.setPhone(phone);
        ls.setVillageName(villageName); ls.setRemark(remark); ls.setUpdatedAt(updatedAt);
        return ls;
    }

    // —— 惠农政策（公域数据，中堰村/陕西现行政策，数据以当地现行政策为准）——
    void seedPolicy() {
        for (Policy p : List.of(
                p("耕地地力保护补贴政策", "惠农补贴", "县农业农村局", "2026-03-15",
                        "对拥有耕地承包权的农户，按确权面积发放耕地地力保护补贴。",
                        "补贴对象：拥有耕地承包权且未改变耕地用途的种地农户。\n补贴标准：以确权面积为准，按当年省级下达标准测算（本村2026年度为每亩约65元）。\n发放方式：通过惠民惠农财政补贴资金“一卡通”直接发放到户。\n注意事项：耕地撂荒或改变用途的不予补贴，请及时核对确权面积。"),
                p("节水灌溉设施建设补贴", "惠农补贴", "县农业农村局", "2026-07-01",
                        "新建或改造滴灌、喷灌等节水灌溉设施，每亩最高补贴800元。",
                        "申请对象：本村从事农业种植的农户或经营主体。\n补贴条件：新建或改造节水灌溉设施，面积不低于1亩。\n补贴标准：每亩最高补贴800元，每户最高补贴5亩。\n所需材料：身份证复印件、土地承包合同、灌溉设施购置发票或施工合同。\n办理地点：村委会一楼便民服务大厅。"),
                p("秸秆综合利用补贴办法", "惠农补贴", "县农业农村局", "2026-05-20",
                        "对秸秆还田、秸秆饲料化、能源化等综合利用方式给予补贴。",
                        "补贴范围：秸秆机械化还田、秸秆青贮饲料化、秸秆固化成型燃料等。\n补贴标准：还田每亩补贴约30元，饲料化按实际收购量测算。\n申请方式：由村集体经济组织或回收企业统一申报，农户配合。\n同时严格执行秸秆禁烧规定，违反禁烧的依法依规处理。"),
                p("城乡居民基本养老保险", "养老医保", "省人力资源和社会保障厅", "2026-01-01",
                        "年满16周岁（不含在校学生）未参加职工养老保险的城乡居民可参保。",
                        "参保范围：本村年满16周岁、非在校学生、未参加职工养老保险的村民。\n缴费档次：每年设多个缴费档次，可自主选择，财政给予相应补贴。\n待遇领取：累计缴费满15年、年满60周岁后按月领取养老金。\n办理方式：携带身份证、户口簿到村委会或乡镇社保窗口办理。"),
                p("城乡居民基本医疗保险", "养老医保", "省医疗保障局", "2026-01-01",
                        "城乡居民基本医疗保险，住院、门诊按规定比例报销。",
                        "参保对象：本村未参加职工医保的城乡居民。\n缴费标准：按当年省级统一标准缴纳，财政给予补助。\n待遇范围：住院医疗费用按医院等级和规定比例报销，另含门诊统筹、大病保险。\n办理方式：每年集中缴费期（通常为上年9月—12月）到村委会或线上缴费。"),
                p("阳光玫瑰葡萄产业发展扶持", "产业发展", "县农业农村局", "2026-04-10",
                        "支持特色果业标准化种植，对阳光玫瑰葡萄园建设给予扶持。",
                        "扶持对象：在本村发展阳光玫瑰葡萄标准化种植的农户、合作社、企业。\n扶持内容：种苗补贴、设施（避雨棚、水肥一体化）补助、技术培训。\n申报条件：连片种植面积达一定规模、符合标准化生产要求。\n办理方式：向村委会申报，由乡镇汇总报县农业农村局审核。"),
                p("农村土地承包经营权确权登记", "土地确权", "县自然资源局", "2026-02-01",
                        "对农村土地承包经营权进行确权登记颁证，稳定承包关系。",
                        "确权范围：本村集体所有的耕地、园地等承包地。\n办理内容：实测地块边界、公示确认、登记颁证（不动产权证书）。\n权益保障：确权后承包关系保持稳定长久不变，可依法流转、抵押。\n如有权属争议，先调解后确权；信息有误可申请勘误更正。")
        )) policyMapper.insert(p);
    }

    Policy p(String title, String category, String source, String publishDate, String summary, String content) {
        Policy p = new Policy();
        p.setTitle(title); p.setCategory(category); p.setSource(source);
        p.setPublishDate(publishDate); p.setSummary(summary); p.setContent(content);
        p.setStatus("生效");
        return p;
    }
}
