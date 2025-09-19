package edu.cit.csit360.UserService;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.cit.csit360.UserEntity.UserEntity;
import edu.cit.csit360.UserRepo.UserRepo;

@Service
public class UserService {
   private final UserRepo userRepository;

    public UserService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    // Create or Update
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
}
