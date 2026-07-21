package com.village.os;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.village.os.mapper")
public class VillageOsApplication {

    public static void main(String[] args) {
        SpringApplication.run(VillageOsApplication.class, args);
    }
}
