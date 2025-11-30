package edu.cit.csit360.UserEntity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")  // renamed to avoid 'user' keyword
    private String user;

    @Column(name = "date_time")
    private LocalDateTime dateTime;

    private String note;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "owner_wallet")
    private String ownerWallet;

    @Column(name = "category")
    private String category;

    // Constructors
    public UserEntity() {}

    public UserEntity(String user, LocalDateTime dateTime, String note, String fileName, String ownerWallet, String category) {
        this.user = user;
        this.dateTime = dateTime;
        this.note = note;
        this.fileName = fileName;
        this.ownerWallet = ownerWallet;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getOwnerWallet() { return ownerWallet; }
    public void setOwnerWallet(String ownerWallet) { this.ownerWallet = ownerWallet; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
