package edu.cit.csit360.UserEntity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_history")
public class AuditHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // optional, can be null if unknown

    private String ownerWallet; // wallet address associated

    @Column(length = 100)
    private String action; // e.g. "Transaction created", "Profile updated"

    @Column(length = 1000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String network; // optional: preview/testnet/mainnet

    public AuditHistory() { this.timestamp = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getOwnerWallet() { return ownerWallet; }
    public void setOwnerWallet(String ownerWallet) { this.ownerWallet = ownerWallet; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }
}
