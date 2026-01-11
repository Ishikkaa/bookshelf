package com.ishikapandita.bookshelf.data;

import com.ishikapandita.bookshelf.model.Role;
import com.ishikapandita.bookshelf.model.User;
import com.ishikapandita.bookshelf.repository.RoleRepository;
import com.ishikapandita.bookshelf.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.util.Optional;
import java.util.Set;

@Transactional
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_PASSWORD}")
    private String rawPassword;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        Set<String> defaultRoles = Set.of("ROLE_USER" , "ROLE_ADMIN");
        createDefaultRoles(defaultRoles);
        createDefaultAdminIfNotExists();
    }

    private void createDefaultRoles(Set<String> roles){
        roles.stream()
                .filter(role -> Optional.ofNullable(roleRepository.findByName(role))
                        .isEmpty()).map(Role::new).forEach(roleRepository::save);
    }

    private void createDefaultAdminIfNotExists(){
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalStateException("ADMIN_PASSWORD environment variable not configured");
        }
        Role adminRole = Optional.ofNullable(roleRepository.findByName("ROLE_ADMIN"))
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        for (int i = 1; i<=3; i++){
            String defaultEmail = "admin"+i+"@email.com";
            if (userRepository.existsByEmail(defaultEmail)){
                continue;
            }
            User user = new User();
            user.setFirstName("Admin");
            user.setLastName("Shop User" + i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRoles(Set.of(adminRole));
            userRepository.save(user);
        }
    }

}

