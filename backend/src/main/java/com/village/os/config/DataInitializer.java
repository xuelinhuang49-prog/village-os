package com.village.os.config;

import com.village.os.entity.*;
import com.village.os.mapper.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminUserMapper adminUserMapper;
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

    @Override
    public void run(String... args) {
        if (adminUserMapper.selectCount(null) > 0) {
            log.info("数据库已初始化，跳过 seed");
            return;
        }
        seed();
        log.info("数据库初始化完成！");
    }

    void seed() {
        seedAdminUsers();
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
    }

    void seedAdminUsers() {
        for (AdminUser u : List.of(
                u("admin", "admin123", "黄雪琳", "超级管理员", "村党支部", "138****0001", "在线", "全部", "#ef4444", "2026-06-23 08:30"),
                u("hong", "hong123", "洪梦冉", "管理员", "村党支部", "138****0002", "在线", "内容、用户", "#f5a623", "2026-06-23 09:00"),
                u("wang", "wang123", "王雍皓", "运营经理", "村民委员会", "138****0003", "离线", "订单、民宿", "#0ea5e9", "2026-06-22 17:30"),
                u("xiaowang", "123456", "小王", "操作员", "村委会", "138****0004", "在线", "政务、补贴", "#0ea5e9", "2026-06-23 07:45"),
                u("xiaoliu", "123456", "小刘", "操作员", "村委会", "138****0005", "离线", "医保、补贴", "#10d6a0", "2026-06-22 18:00")
        )) adminUserMapper.insert(u);
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

    // ---- helper factories ----
    AdminUser u(String username, String password, String name, String role, String org, String phone, String status, String permissions, String avatarColor, String lastLogin) {
        AdminUser u = new AdminUser();
        u.setUsername(username); u.setPassword(password); u.setName(name); u.setRole(role);
        u.setOrg(org); u.setPhone(phone); u.setStatus(status); u.setPermissions(permissions);
        u.setAvatarColor(avatarColor); u.setLastLogin(lastLogin);
        return u;
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
}
