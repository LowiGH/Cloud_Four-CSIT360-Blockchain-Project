package edu.cit.csit360.UserRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.cit.csit360.UserEntity.AuditHistory;
import java.util.List;

@Repository
public interface AuditHistoryRepo extends JpaRepository<AuditHistory, Long> {
    List<AuditHistory> findByOwnerWallet(String ownerWallet);
    List<AuditHistory> findByUserId(Long userId);
    List<AuditHistory> findByOrderByTimestampDesc();
}
