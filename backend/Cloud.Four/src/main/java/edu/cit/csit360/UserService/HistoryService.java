package edu.cit.csit360.UserService;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;

import edu.cit.csit360.UserEntity.AuditHistory;
import edu.cit.csit360.UserRepo.AuditHistoryRepo;

@Service
public class HistoryService {
    @Autowired
    private AuditHistoryRepo repo;

    public AuditHistory save(AuditHistory entry) {
        return repo.save(entry);
    }

    public List<AuditHistory> getByWallet(String wallet) {
        if (wallet == null) return List.of();
        // normalize wallet for consistent lookup
        String norm = wallet == null ? null : wallet.trim().toLowerCase().replaceAll("\\s+", "");
        return repo.findByOwnerWallet(norm).stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    public List<AuditHistory> getByUserId(Long userId) {
        if (userId == null) return List.of();
        return repo.findByUserId(userId).stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    public List<AuditHistory> getAll() {
        return repo.findByOrderByTimestampDesc();
    }
}
