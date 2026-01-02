package com.ishikapandita.bookshelf.repository;

import com.ishikapandita.bookshelf.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String userRole);
}
