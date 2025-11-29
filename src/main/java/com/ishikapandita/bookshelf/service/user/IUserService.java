package com.ishikapandita.bookshelf.service.user;

import com.ishikapandita.bookshelf.dtos.UserDto;
import com.ishikapandita.bookshelf.model.User;
import com.ishikapandita.bookshelf.request.CreateUserRequest;
import com.ishikapandita.bookshelf.request.UserUpdateRequest;

public interface IUserService {
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request, Long userId);
    User getUserById(Long userId);
    void deleteUser(Long userId);
    UserDto convertUserToDto(User user);
    User getAuthenticatedUser();
}
