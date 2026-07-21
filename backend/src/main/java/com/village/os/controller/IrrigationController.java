package com.village.os.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.village.os.common.Result;
import com.village.os.entity.IrrigationRecord;
import com.village.os.mapper.IrrigationRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/irrigation")
@RequiredArgsConstructor
public class IrrigationController {

    private final IrrigationRecordMapper recordMapper;

    // Track active device states in memory
    private final Map<String, LocalDateTime> activeDevices = new HashMap<>();

    @PostMapping("/start")
    public Result start(@RequestBody Map<String, String> body) {
        String deviceName = body.get("deviceName");
        String deviceId = body.getOrDefault("deviceId", deviceName);
        String area = body.getOrDefault("area", "");
        String startMode = body.getOrDefault("startMode", "手动");
        String operator = body.getOrDefault("operator", "管理员");
        String soilBefore = body.getOrDefault("soilBefore", "--");

        // Check if already running
        IrrigationRecord running = recordMapper.selectOne(
            new QueryWrapper<IrrigationRecord>().eq("device_name", deviceName).eq("status", "running")
        );
        if (running != null) {
            return Result.fail("该设备已在运行中，请勿重复启动");
        }

        IrrigationRecord record = new IrrigationRecord();
        record.setDeviceName(deviceName);
        record.setDeviceId(deviceId);
        record.setArea(area);
        record.setStartTime(LocalDateTime.now());
        record.setStartMode(startMode);
        record.setOperator(operator);
        record.setSoilBefore(soilBefore);
        record.setStatus("running");
        record.setCreateTime(LocalDateTime.now());
        recordMapper.insert(record);

        activeDevices.put(deviceName, LocalDateTime.now());

        Map<String, Object> result = new HashMap<>();
        result.put("recordId", record.getId());
        result.put("startTime", record.getStartTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return Result.ok(result);
    }

    @PostMapping("/stop")
    public Result stop(@RequestBody Map<String, String> body) {
        String deviceName = body.get("deviceName");
        String soilAfter = body.getOrDefault("soilAfter", "--");
        String waterUsage = body.getOrDefault("waterUsage", "0");
        String avgFlow = body.getOrDefault("avgFlow", "0");

        IrrigationRecord record = recordMapper.selectOne(
            new QueryWrapper<IrrigationRecord>().eq("device_name", deviceName).eq("status", "running")
        );
        if (record == null) {
            return Result.fail("该设备未在运行中");
        }

        record.setStopTime(LocalDateTime.now());
        record.setSoilAfter(soilAfter);
        record.setWaterUsage(Double.parseDouble(waterUsage));
        record.setAvgFlow(Double.parseDouble(avgFlow));
        record.setDurationSeconds(java.time.Duration.between(record.getStartTime(), record.getStopTime()).getSeconds());
        record.setStatus("completed");
        recordMapper.updateById(record);

        activeDevices.remove(deviceName);

        Map<String, Object> result = new HashMap<>();
        result.put("recordId", record.getId());
        result.put("durationSeconds", record.getDurationSeconds());
        return Result.ok(result);
    }

    @GetMapping("/running")
    public Result getRunning() {
        List<IrrigationRecord> records = recordMapper.selectList(
            new QueryWrapper<IrrigationRecord>().eq("status", "running").orderByDesc("create_time")
        );
        List<Map<String, Object>> list = new ArrayList<>();
        for (IrrigationRecord r : records) {
            Map<String, Object> m = toMap(r);
            m.put("elapsedSeconds", java.time.Duration.between(r.getStartTime(), LocalDateTime.now()).getSeconds());
            list.add(m);
        }
        return Result.ok(list);
    }

    @GetMapping("/records")
    public Result getRecords(@RequestParam(required = false) String device,
                             @RequestParam(required = false) String status,
                             @RequestParam(required = false) String date) {
        QueryWrapper<IrrigationRecord> qw = new QueryWrapper<>();
        if (device != null && !device.isEmpty()) qw.eq("device_name", device);
        if (status != null && !status.isEmpty()) qw.eq("status", status);
        if (date != null && !date.isEmpty()) qw.likeRight("start_time", date);
        qw.orderByDesc("create_time");
        List<IrrigationRecord> records = recordMapper.selectList(qw);
        List<Map<String, Object>> list = new ArrayList<>();
        for (IrrigationRecord r : records) {
            Map<String, Object> m = toMap(r);
            if ("running".equals(r.getStatus())) {
                m.put("elapsedSeconds", java.time.Duration.between(r.getStartTime(), LocalDateTime.now()).getSeconds());
            }
            list.add(m);
        }
        return Result.ok(list);
    }

    @GetMapping("/detail/{id}")
    public Result detail(@PathVariable Long id) {
        IrrigationRecord r = recordMapper.selectById(id);
        if (r == null) return Result.fail("记录不存在");
        Map<String, Object> m = toMap(r);
        if ("running".equals(r.getStatus())) {
            m.put("elapsedSeconds", java.time.Duration.between(r.getStartTime(), LocalDateTime.now()).getSeconds());
        }
        return Result.ok(m);
    }

    @PostMapping("/abort")
    public Result abort(@RequestBody Map<String, String> body) {
        String deviceName = body.get("deviceName");
        String reason = body.getOrDefault("reason", "未知异常");
        IrrigationRecord record = recordMapper.selectOne(
            new QueryWrapper<IrrigationRecord>().eq("device_name", deviceName).eq("status", "running")
        );
        if (record == null) return Result.fail("该设备未在运行中");

        record.setStopTime(LocalDateTime.now());
        record.setStatus("abnormal");
        record.setErrorNote(reason);
        record.setDurationSeconds(java.time.Duration.between(record.getStartTime(), record.getStopTime()).getSeconds());
        recordMapper.updateById(record);
        activeDevices.remove(deviceName);
        return Result.ok("已标记为异常中断");
    }

    @GetMapping("/export")
    public Result export(@RequestParam(required = false) String device, @RequestParam(required = false) String date) {
        QueryWrapper<IrrigationRecord> qw = new QueryWrapper<>();
        if (device != null && !device.isEmpty()) qw.eq("device_name", device);
        if (date != null && !date.isEmpty()) qw.likeRight("start_time", date);
        qw.orderByDesc("create_time");
        List<IrrigationRecord> records = recordMapper.selectList(qw);

        StringBuilder sb = new StringBuilder();
        sb.append("设备名称,设备编号,所属区域,启动时间,停止时间,运行时长(秒),启动方式,操作人员,用水量(m³),平均流量(m³/h),启动前湿度,停止时湿度,状态,异常说明\n");
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (IrrigationRecord r : records) {
            sb.append(String.join(",", r.getDeviceName(), r.getDeviceId(), r.getArea()!=null?r.getArea():"",
                r.getStartTime()!=null?r.getStartTime().format(fmt):"",
                r.getStopTime()!=null?r.getStopTime().format(fmt):"",
                String.valueOf(r.getDurationSeconds()!=null?r.getDurationSeconds():0),
                r.getStartMode(), r.getOperator()!=null?r.getOperator():"",
                String.valueOf(r.getWaterUsage()!=null?r.getWaterUsage():0),
                String.valueOf(r.getAvgFlow()!=null?r.getAvgFlow():0),
                r.getSoilBefore()!=null?r.getSoilBefore():"",
                r.getSoilAfter()!=null?r.getSoilAfter():"",
                r.getStatus(), r.getErrorNote()!=null?r.getErrorNote():"")).append("\n");
        }
        return Result.ok(sb.toString());
    }

    private Map<String, Object> toMap(IrrigationRecord r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("deviceName", r.getDeviceName());
        m.put("deviceId", r.getDeviceId());
        m.put("area", r.getArea());
        m.put("startTime", r.getStartTime() != null ? r.getStartTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        m.put("stopTime", r.getStopTime() != null ? r.getStopTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        m.put("durationSeconds", r.getDurationSeconds());
        m.put("startMode", r.getStartMode());
        m.put("operator", r.getOperator());
        m.put("waterUsage", r.getWaterUsage());
        m.put("avgFlow", r.getAvgFlow());
        m.put("soilBefore", r.getSoilBefore());
        m.put("soilAfter", r.getSoilAfter());
        m.put("status", r.getStatus());
        m.put("errorNote", r.getErrorNote());
        return m;
    }
}
