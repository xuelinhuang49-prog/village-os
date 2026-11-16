package com.village.os.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * 通用 CRUD 服务基类
 * 对应 Python 版 get_list / get_by_id / create_item / update_item / delete_item
 */
@RequiredArgsConstructor
public class BaseService<M extends BaseMapper<T>, T> {

    protected final M mapper;

    public List<T> list() {
        return mapper.selectList(null);
    }

    public List<T> list(LambdaQueryWrapper<T> wrapper) {
        return mapper.selectList(wrapper);
    }

    public T getById(Long id) {
        return mapper.selectById(id);
    }

    public boolean save(T entity) {
        return mapper.insert(entity) > 0;
    }

    public boolean updateById(T entity) {
        return mapper.updateById(entity) > 0;
    }

    /**
     * 按 Map 更新字段（对应 Python update_item）
     */
    public T updateFields(Long id, Map<String, Object> fields) {
        T entity = mapper.selectById(id);
        if (entity == null) return null;
        try {
            for (Map.Entry<String, Object> entry : fields.entrySet()) {
                var field = entity.getClass().getDeclaredField(entry.getKey());
                field.setAccessible(true);
                field.set(entity, coerce(entry.getValue(), field.getType()));
            }
        } catch (Exception e) {
            throw new RuntimeException("更新字段失败", e);
        }
        mapper.updateById(entity);
        return mapper.selectById(id);
    }

    /** 数值类型适配：JSON 反序列化到 Map 时整数会变 Integer、小数变 Double，
     *  直接 field.set 会因类型不匹配抛异常，这里按目标字段类型做转换。 */
    private Object coerce(Object value, Class<?> target) {
        if (value == null) return null;
        if (target.isInstance(value)) return value;
        if (value instanceof Number) {
            Number n = (Number) value;
            if (target == Double.class || target == double.class) return n.doubleValue();
            if (target == Integer.class || target == int.class) return n.intValue();
            if (target == Long.class || target == long.class) return n.longValue();
            if (target == Float.class || target == float.class) return n.floatValue();
            if (target == Short.class || target == short.class) return n.shortValue();
        }
        if (target == String.class) return String.valueOf(value);
        return value;
    }

    public boolean removeById(Long id) {
        return mapper.deleteById(id) > 0;
    }
}
