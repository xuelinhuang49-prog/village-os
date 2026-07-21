package com.village.os.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.village.os.entity.Product;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}
