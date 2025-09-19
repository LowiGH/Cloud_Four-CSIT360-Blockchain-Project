package edu.cit.csit360.UserRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.csit360.UserEntity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Long> {

}
