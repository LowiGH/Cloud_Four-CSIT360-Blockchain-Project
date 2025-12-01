package edu.cit.csit360.UserController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.csit360.UserEntity.AuditHistory;
import edu.cit.csit360.UserService.HistoryService;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:5173")
public class HistoryController {
    @Autowired
    private HistoryService service;

    @GetMapping
    public List<AuditHistory> getAll() {
        return service.getAll();
    }

    @GetMapping("/wallet/{wallet}")
    public List<AuditHistory> getByWallet(@PathVariable String wallet) {
        return service.getByWallet(wallet);
    }

    @GetMapping("/users/{userId}")
    public List<AuditHistory> getByUser(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<AuditHistory> create(@RequestBody AuditHistory entry) {
        if (entry == null) return ResponseEntity.badRequest().build();
        AuditHistory saved = service.save(entry);
        return ResponseEntity.ok(saved);
    }
}
