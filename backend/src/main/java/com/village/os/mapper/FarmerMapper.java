package com.village.os.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.village.os.entity.Farmer;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FarmerMapper extends BaseMapper<Farmer> {
}
