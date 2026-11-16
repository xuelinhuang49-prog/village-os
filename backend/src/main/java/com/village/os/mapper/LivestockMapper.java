package com.village.os.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.village.os.entity.Livestock;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LivestockMapper extends BaseMapper<Livestock> {
}
