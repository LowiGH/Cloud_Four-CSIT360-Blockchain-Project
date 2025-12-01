package edu.cit.csit360.UserService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.cit.csit360.UserEntity.UserEntity;
import edu.cit.csit360.Utils.AddressUtils;
import edu.cit.csit360.UserEntity.AuditHistory;
import edu.cit.csit360.UserRepo.AuditHistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import edu.cit.csit360.UserRepo.UserRepo;

@Service
public class UserService {
      private final UserRepo userRepository;

    @Autowired
    private AuditHistoryRepo auditRepo;

    public UserService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    // Create or Update (generic)
    public UserEntity saveUser(UserEntity user) {
        return userRepository.save(user);
    }

    // Read all users
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // Read by ID
    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Delete by ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // -----------------------------
    // PROFILE SPECIFIC METHODS HERE
    // -----------------------------

    // Get profile (ID = 1)
    public UserEntity getProfile() {
        // prefer profile id=1 if present, otherwise return the first user in the DB
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    // Update profile fields only
    public UserEntity updateProfile(UserEntity updated) {

        // prefer profile id=1 if present, otherwise update/create the first user
        UserEntity existing = userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
        if (existing == null) {
            // No users exist: create a new one
            updated.setOwnerWallet(AddressUtils.normalize(updated.getOwnerWallet()));
            UserEntity saved = userRepository.save(updated);
            try {
                AuditHistory h = new AuditHistory();
                h.setUserId(saved.getId());
                h.setOwnerWallet(saved.getOwnerWallet());
                h.setAction("Profile created");
                h.setDetails("Profile created for user: " + (saved.getUser() == null ? "" : saved.getUser()));
                auditRepo.save(h);
            } catch (Exception e) { System.err.println("Failed to save profile audit: " + e.getMessage()); }
            return saved;
        }

        existing.setUser(updated.getUser());
        existing.setEmail(updated.getEmail());
        existing.setOwnerWallet(AddressUtils.normalize(updated.getOwnerWallet()));

        UserEntity saved = userRepository.save(existing);
            System.out.println("[UserService] updateProfile incoming: user=" + updated.getUser() + " email=" + updated.getEmail() + " ownerWallet=" + updated.getOwnerWallet());
            System.out.println("[UserService] profile saved id=" + saved.getId() + " user=" + saved.getUser() + " ownerWallet=" + saved.getOwnerWallet());

        // record audit/history for profile update
        try {
            AuditHistory h = new AuditHistory();
            h.setUserId(saved.getId());
            h.setOwnerWallet(saved.getOwnerWallet());
            h.setAction("Profile updated");
            h.setDetails("Profile updated for user: " + (saved.getUser() == null ? "" : saved.getUser()));
            auditRepo.save(h);
        } catch (Exception e) { System.err.println("Failed to save profile audit: " + e.getMessage()); }

        return saved;
    }
}
