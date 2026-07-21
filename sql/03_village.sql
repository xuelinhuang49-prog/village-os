-- =============================================
-- Sprint 1: 村庄种子数据
-- 中堰村 - 默认村庄
-- =============================================

INSERT INTO village (id, tenant_id, name, province, city, county, address,
    longitude, latitude, area, population, households, industry_type,
    description, contact_person, contact_phone, status)
VALUES (
    1, 1,
    '中堰村',
    '陕西省', '安康市', '汉阴县',
    '汉阴县中堰村',
    108.51, 32.89,
    8.6, 2156, 612,
    '智慧农业,乡村旅游,水产养殖',
    '中堰村位于陕西省安康市汉阴县，村域面积8.6平方公里，辖12个村民小组，总人口2156人，共612户。村内拥有智慧农业产业园、大棚种植基地、荷虾混养示范区等现代农业产业。',
    '张书记', '13900000001',
    1
)
ON CONFLICT (id) DO NOTHING;

SELECT setval('village_id_seq', COALESCE((SELECT MAX(id) FROM village), 1));
