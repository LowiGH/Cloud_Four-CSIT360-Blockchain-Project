package edu.cit.csit360;

import edu.cit.csit360.UserEntity.User;
import edu.cit.csit360.UserRepo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin account if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@cloudfour.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setWalletAddress(""); // Will be set by blockchain integration
            
            userRepository.save(admin);
            System.out.println("========================================");
            System.out.println("ADMIN ACCOUNT CREATED!");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("Email: admin@cloudfour.com");
            System.out.println("========================================");
        }
    }
}

