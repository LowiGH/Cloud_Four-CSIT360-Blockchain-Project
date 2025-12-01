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

    @Column(name = "username")
    private String user;

    @Column(nullable = true, unique = true)
    private String email;

    @Column(name = "owner_wallet")
    private String ownerWallet;    // this is your wallet ID

    @Column(name = "date_time")
    private LocalDateTime dateTime;

    private String note;

    @Column(name = "file_name")
    private String fileName;

    public UserEntity() {}

    public UserEntity(String user, String email, String ownerWallet,
                      LocalDateTime dateTime, String note, String fileName) {
        this.user = user;
        this.email = email;
        this.ownerWallet = ownerWallet;
        this.dateTime = dateTime;
        this.note = note;
        this.fileName = fileName;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOwnerWallet() { return ownerWallet; }
    public void setOwnerWallet(String ownerWallet) { this.ownerWallet = ownerWallet; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
}
