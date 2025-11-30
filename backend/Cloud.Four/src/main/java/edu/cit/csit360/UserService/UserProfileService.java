package edu.cit.csit360.UserService;

import edu.cit.csit360.UserEntity.User;
import edu.cit.csit360.UserRepo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserProfileService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Map<String, Object> updateProfile(Long id, String username, String email, String walletAddress) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        User user = userOpt.get();

        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(username) && userRepository.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setWalletAddress(walletAddress);
        user = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Profile updated successfully");
        response.put("user", Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "walletAddress", user.getWalletAddress()
        ));

        return response;
    }
}

