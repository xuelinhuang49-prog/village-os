package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.Farmer;
import com.village.os.entity.ServiceRequest;
import com.village.os.mapper.FarmerMapper;
import com.village.os.mapper.ServiceRequestMapper;
import com.village.os.util.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 村民诉求上报（私域数据）—— 行级权限核心示例
 * - /submit、/my-list：仅农户，且 /my-list 后端强制 where farmer_id = 当前登录农户
 * - /admin/list、/admin/reply：仅管理员，可查/处理全村诉求
 */
@RestController
@RequestMapping("/api/v1/service-request")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestMapper mapper;
    private final FarmerMapper farmerMapper;

    /** 村民提交诉求：farmer_id 从 token 解析，前端不传，防止篡改 */
    @PostMapping("/submit")
    public Result<ServiceRequest> submit(@RequestBody SubmitReq req) {
        if (!isFarmer()) return Result.forbidden("请以农户身份登录后提交");
        Long farmerId = currentUserId();
        if (farmerId == null) return Result.forbidden("登录态异常，请重新登录");

        ServiceRequest r = new ServiceRequest();
        r.setFarmerId(farmerId);
        r.setRequestType(req.getRequestType());
        r.setContent(req.getContent());
        r.setContactPhone(req.getContactPhone());
        r.setStatus("PENDING");
        r.setCreateTime(LocalDateTime.now());
        r.setUpdateTime(LocalDateTime.now());
        mapper.insert(r);
        return Result.ok(r);
    }

    /** 我的办事记录：强制 where farmer_id = 当前登录农户，防止越权看他人数据 */
    @GetMapping("/my-list")
    public Result<List<ServiceRequest>> myList() {
        if (!isFarmer()) return Result.forbidden("请以农户身份登录");
        Long farmerId = currentUserId();
        List<ServiceRequest> list = mapper.selectList(
                new LambdaQueryWrapper<ServiceRequest>()
                        .eq(ServiceRequest::getFarmerId, farmerId)
                        .orderByDesc(ServiceRequest::getCreateTime));
        return Result.ok(list);
    }

    /** 管理员：全村诉求列表（支持状态筛选，回填农户姓名便于派单/联系） */
    @GetMapping("/admin/list")
    public Result<List<ServiceRequest>> adminList(@RequestParam(required = false) String status) {
        if (!isAdmin()) return Result.forbidden("仅管理员可访问");
        LambdaQueryWrapper<ServiceRequest> w = new LambdaQueryWrapper<>();
        if (status != null && !status.isBlank()) w.eq(ServiceRequest::getStatus, status);
        w.orderByDesc(ServiceRequest::getCreateTime);
        List<ServiceRequest> list = mapper.selectList(w);
        // 回填农户姓名（farmer_id → farmer.name），避免只暴露一个无意义的数字 ID
        if (!list.isEmpty()) {
            List<Long> farmerIds = list.stream().map(ServiceRequest::getFarmerId).distinct().toList();
            Map<Long, String> nameMap = farmerMapper.selectBatchIds(farmerIds).stream()
                    .collect(Collectors.toMap(Farmer::getId, Farmer::getName, (a, b) -> a));
            list.forEach(r -> r.setFarmerName(nameMap.getOrDefault(r.getFarmerId(), "")));
        }
        return Result.ok(list);
    }

    /** 管理员：回复 + 更新处理状态 */
    @PutMapping("/admin/reply/{id}")
    public Result<ServiceRequest> reply(@PathVariable Long id, @RequestBody ReplyReq req) {
        if (!isAdmin()) return Result.forbidden("仅管理员可操作");
        ServiceRequest r = mapper.selectById(id);
        if (r == null) return Result.fail("诉求不存在");
        if (req.getStatus() != null) r.setStatus(req.getStatus());
        if (req.getAdminReply() != null) r.setAdminReply(req.getAdminReply());
        r.setUpdateTime(LocalDateTime.now());
        mapper.updateById(r);
        return Result.ok(r);
    }

    // —— 从 SecurityContext 取当前登录人（user_id 即 farmer 主键 / admin 主键）——
    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getCredentials() instanceof Long)) return null;
        return (Long) auth.getCredentials();
    }

    private boolean isFarmer() {
        return SecurityUtils.isFarmer();
    }

    private boolean isAdmin() {
        return SecurityUtils.isAdmin();
    }

    @Data
    static class SubmitReq {
        private String requestType;
        private String content;
        private String contactPhone;
    }

    @Data
    static class ReplyReq {
        private String status;
        private String adminReply;
    }
}
