package edu.cit.csit360.UserEntity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cardano_transactions")
public class Transaction {
 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String type; // "Send" or "Receive"
    
    @Column(nullable = false, unique = true)
    private String txHash;
    
    private String toAddress;
    private String fromAddress;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private String status; // "Confirmed", "Pending", "Failed"
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(length = 500)
    private String memo;
    
    private String ownerWallet; // User's wallet address
    
    // Constructors
    public Transaction() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTxHash() { return txHash; }
    public void setTxHash(String txHash) { this.txHash = txHash; }
    
    public String getToAddress() { return toAddress; }
    public void setToAddress(String toAddress) { this.toAddress = toAddress; }
    
    public String getFromAddress() { return fromAddress; }
    public void setFromAddress(String fromAddress) { this.fromAddress = fromAddress; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }
    
    public String getOwnerWallet() { return ownerWallet; }
    public void setOwnerWallet(String ownerWallet) { this.ownerWallet = ownerWallet; }
}