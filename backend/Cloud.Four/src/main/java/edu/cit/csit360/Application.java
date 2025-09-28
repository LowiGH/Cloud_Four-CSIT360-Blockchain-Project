package edu.cit.csit360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



@SpringBootApplication
@ComponentScan(basePackages = {"edu.cit.csit360.UserController", "edu.cit.csit360.UserService"})
@EntityScan(basePackages = {"edu.cit.csit360.UserEntity"})
@EnableJpaRepositories(basePackages = {"edu.cit.csit360.UserRepo"})
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}



}
