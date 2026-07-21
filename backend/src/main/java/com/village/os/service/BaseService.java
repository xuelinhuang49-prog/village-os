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
                field.set(entity, entry.getValue());
            }
        } catch (Exception e) {
            throw new RuntimeException("更新字段失败", e);
        }
        mapper.updateById(entity);
        return mapper.selectById(id);
    }

    public boolean removeById(Long id) {
        return mapper.deleteById(id) > 0;
    }
}
